-- 1
-- insert Tony Stark's info into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2
-- modify the Stark record to account_type = Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3
-- delete the Stark record
DELETE FROM account
WHERE account_firstname = 'Tony'
AND account_id = 1;

-- 4
-- modify the "GM Hummer" record 
-- ('a huge interior' => 'small interiors')
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'a huge interior', 'a small interior')
WHERE inv_id = 10;

-- 5
-- select make and model, join classification and inventory, where classification == "Sport"
SELECT inv_make, inv_model, classification_name FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 6
-- update image paths
UPDATE inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/'), 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/')
WHERE inv_thumbnail NOT LIKE '/images/vehicles/%'
AND inv_image NOT LIKE '/images/vehicles/%';