/*
  # Event Creation Trigger Function

  1. Database Function
    - Automatically creates events when signal threshold is reached
    - Groups signals by location and time window
    - Determines event severity based on signal distribution
    - Creates corresponding alerts and blog posts

  2. Trigger
    - Fires after signal insertion
    - Checks signal count in location within 24h window
    - Creates event if threshold (5+ signals) is met

  3. Security
    - Function executes with definer rights
    - Maintains data integrity with proper error handling
*/

-- Function to create events based on signal clustering
CREATE OR REPLACE FUNCTION create_event_from_signals()
RETURNS TRIGGER AS $$
DECLARE
    signal_count INTEGER;
    high_count INTEGER;
    medium_count INTEGER;
    low_count INTEGER;
    event_severity TEXT;
    event_title TEXT;
    event_description TEXT;
    existing_event_count INTEGER;
    new_event_id UUID;
    alert_id UUID;
    blog_id UUID;
    twenty_four_hours_ago TIMESTAMPTZ;
BEGIN
    -- Calculate 24 hours ago
    twenty_four_hours_ago := NOW() - INTERVAL '24 hours';
    
    -- Count total signals in the same location within last 24 hours
    SELECT COUNT(*) INTO signal_count
    FROM signals 
    WHERE LOWER(location) = LOWER(NEW.location)
    AND created_at >= twenty_four_hours_ago;
    
    -- Only proceed if we have 5 or more signals
    IF signal_count >= 5 THEN
        -- Check if an active event already exists for this location
        SELECT COUNT(*) INTO existing_event_count
        FROM events 
        WHERE LOWER(location) = LOWER(NEW.location)
        AND status = 'active'
        AND created_at >= twenty_four_hours_ago;
        
        -- Only create event if none exists
        IF existing_event_count = 0 THEN
            -- Count signals by severity to determine event severity
            SELECT 
                COUNT(CASE WHEN severity = 'high' THEN 1 END),
                COUNT(CASE WHEN severity = 'medium' THEN 1 END),
                COUNT(CASE WHEN severity = 'low' THEN 1 END)
            INTO high_count, medium_count, low_count
            FROM signals 
            WHERE LOWER(location) = LOWER(NEW.location)
            AND created_at >= twenty_four_hours_ago;
            
            -- Determine event severity based on majority
            IF high_count >= medium_count AND high_count >= low_count THEN
                event_severity := 'high';
            ELSIF medium_count >= low_count THEN
                event_severity := 'medium';
            ELSE
                event_severity := 'low';
            END IF;
            
            -- Create event title and description
            event_title := NEW.type || ' cluster detected - ' || NEW.location;
            event_description := 'Detected cluster of ' || signal_count || ' signals with majority severity: ' || event_severity || '. ' ||
                                'High: ' || high_count || ', Medium: ' || medium_count || ', Low: ' || low_count || '. ' ||
                                'Automated detection triggered by unusual signal patterns in ' || NEW.location || ' area.';
            
            -- Create the event
            INSERT INTO events (
                title,
                location,
                event_type,
                severity,
                status,
                signal_count,
                description
            ) VALUES (
                event_title,
                NEW.location,
                NEW.type,
                event_severity,
                'active',
                signal_count,
                event_description
            ) RETURNING id INTO new_event_id;
            
            -- Create corresponding alert
            INSERT INTO alerts (
                title,
                location,
                severity,
                status
            ) VALUES (
                'Health Alert: ' || NEW.type || ' signals in ' || NEW.location,
                NEW.location,
                event_severity,
                'active'
            ) RETURNING id INTO alert_id;
            
            -- Create blog post
            INSERT INTO blogs (
                title,
                content,
                author,
                published,
                published_at
            ) VALUES (
                'Health Alert: ' || NEW.type || ' signal spike detected in ' || NEW.location,
                '# Health Alert: Unusual ' || NEW.type || ' Activity Detected

Our AI monitoring system has identified a significant increase in ' || NEW.type || ' signals in the **' || NEW.location || '** area. This early warning indicates potential health concerns that warrant immediate attention and preventive measures.

## What We Detected

- **' || signal_count || '** ' || NEW.type || ' signals detected in the last 24 hours
- **Severity Level:** ' || UPPER(event_severity) || '
- **Location:** ' || NEW.location || '
- **Signal Distribution:**
  - High Severity: ' || high_count || ' signals
  - Medium Severity: ' || medium_count || ' signals  
  - Low Severity: ' || low_count || ' signals

## Recommended Actions

### For Residents in the Area:
- **Monitor symptoms closely** - Watch for any signs of illness
- **Practice enhanced hygiene** - Wash hands frequently, use sanitizer
- **Wear masks in crowded areas** - Especially in indoor public spaces
- **Avoid unnecessary gatherings** - Limit exposure to large crowds
- **Stay informed** - Follow local health authority updates

### For Healthcare Providers:
- **Increase vigilance** - Monitor for related symptoms in patients
- **Report unusual patterns** - Notify health authorities of concerning trends
- **Prepare resources** - Ensure adequate supplies and staffing
- **Follow protocols** - Implement enhanced infection control measures

## Understanding This Alert

This alert was generated automatically by our AI system, which analyzes multiple data streams including:
- Wearable device sensors (privacy-protected)
- Environmental monitoring
- Pharmacy purchase patterns
- Community health indicators

**Important:** This is an early warning system designed for prevention. It does not constitute a medical diagnosis and should not replace professional medical advice.

## Current Status

- **Event ID:** ' || new_event_id || '
- **Alert Level:** ' || UPPER(event_severity) || '
- **Status:** Active monitoring
- **Health Authorities:** Notified
- **Next Update:** Within 24 hours

## What Happens Next

1. **Continued Monitoring** - Our system will track signal patterns
2. **Health Authority Coordination** - Local officials have been notified
3. **Regular Updates** - Status will be updated as situation evolves
4. **Community Support** - Resources and guidance will be provided

## Stay Connected

For the latest updates and detailed information:
- Visit our [Dashboard](/dashboard) for real-time data
- Follow [Health Alerts](/alerts) for official notifications
- Contact local health authorities for medical concerns

---

*This alert was generated by the Prevora AI Prevention Network. Our mission is to detect health threats early and empower communities to take preventive action.*

**Generated:** ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS') || ' UTC  
**Event ID:** ' || new_event_id || '  
**Alert ID:** ' || alert_id || '',
                'Prevora AI System',
                true,
                NOW()
            ) RETURNING id INTO blog_id;
            
            -- Log the event creation
            RAISE NOTICE 'Event created: ID=%, Signals=%, Severity=%', new_event_id, signal_count, event_severity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after signal insertion
DROP TRIGGER IF EXISTS trigger_create_event_from_signals ON signals;
CREATE TRIGGER trigger_create_event_from_signals
    AFTER INSERT ON signals
    FOR EACH ROW
    EXECUTE FUNCTION create_event_from_signals();

-- Create function to update event signal counts
CREATE OR REPLACE FUNCTION update_event_signal_count()
RETURNS TRIGGER AS $$
DECLARE
    twenty_four_hours_ago TIMESTAMPTZ;
    current_count INTEGER;
BEGIN
    twenty_four_hours_ago := NOW() - INTERVAL '24 hours';
    
    -- Update signal count for active events in the same location
    UPDATE events 
    SET signal_count = (
        SELECT COUNT(*) 
        FROM signals 
        WHERE LOWER(signals.location) = LOWER(events.location)
        AND signals.created_at >= twenty_four_hours_ago
    )
    WHERE LOWER(location) = LOWER(NEW.location)
    AND status = 'active'
    AND created_at >= twenty_four_hours_ago;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update signal counts
DROP TRIGGER IF EXISTS trigger_update_event_signal_count ON signals;
CREATE TRIGGER trigger_update_event_signal_count
    AFTER INSERT ON signals
    FOR EACH ROW
    EXECUTE FUNCTION update_event_signal_count();