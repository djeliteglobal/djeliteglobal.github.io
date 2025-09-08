-- Auto-cleanup trigger for matches
CREATE OR REPLACE FUNCTION cleanup_match_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all swipes between the two profiles
  DELETE FROM swipes 
  WHERE (swiper_id = OLD.profile1_id AND swiped_id = OLD.profile2_id)
     OR (swiper_id = OLD.profile2_id AND swiped_id = OLD.profile1_id);
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger that runs BEFORE match deletion
CREATE TRIGGER match_cleanup_trigger
  BEFORE DELETE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_match_data();