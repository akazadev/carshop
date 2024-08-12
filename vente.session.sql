-- Table des Utilisateurs
--indentation


CREATE TABLE Users (
                       userID SERIAL PRIMARY KEY,
                       nom VARCHAR(50),
                       prenom VARCHAR(50),
                       email VARCHAR(100) UNIQUE,
                       mot_de_passe VARCHAR(100)
);

--insérer des utilisateurs
INSERT INTO Users (nom, prenom, email, mot_de_passe)
VALUES
    ('Doe', 'John', 'john.doe@example.com', 'motdepasse1'),
    ('Smith', 'Alice', 'alice.smith@example.com', 'motdepasse2'),
    ('Johnson', 'Bob', 'bob.johnson@example.com', 'motdepasse3');

-- Table des Commandes
CREATE TABLE Orders (
                        orderID SERIAL PRIMARY KEY,
                        userID INT REFERENCES Users(userID),
                        date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        statut_commande VARCHAR(20) DEFAULT 'en_attente' -- Vous pouvez ajouter d'autres statuts
);

--insérer quelques commandes
INSERT INTO Orders (userID, date_commande, statut_commande) VALUES
    (9, '2022-01-01', 'en_attente'),
    (10, '2022-01-02', 'en_attente'),
    (11, '2022-01-03', 'en_attente');

SELECT * FROM Orders;


--créer un trigger pour mettre à jour les données dans la table orderdetails
--fonction qui permet de mettre à jour la quantité en stock d'une voiture dès qu'une commande est insérée dans la table orders
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
    DECLARE qnt INTEGER;
BEGIN
    UPDATE cars
    SELECT quantite_commandee INTO qnt FROM orderdetails WHERE carid = NEW.carID;
    SET quantite_en_stock = quantite_en_stock - qnt;
    WHERE carid = NEW.carid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM users;




--ajouter le trigger à la table order
CREATE TRIGGER update_stock_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_stock();

--créer un trigger pour insérer  le orderID, le carID, la quantité commandée et le prix unitaire dans la table orderdetails
--fonction qui permet de récupérer le id d'une commande dès qu'elle est insérée dans la table orders
CREATE OR REPLACE FUNCTION insert_order_details()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO OrderDetails (orderID, carID, quantite_commandee, prix_unitaire)
    VALUES (NEW.orderID, NEW.carID, NEW.quantite_commandee, (SELECT prix_unitaire FROM Cars WHERE carID = NEW.carID));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table des Détails de la Commande
CREATE TABLE OrderDetails (
                              detailID SERIAL PRIMARY KEY,
                              orderID INT REFERENCES Orders(orderID),
                              carID INT REFERENCES Cars(carID),
                              quantite_commandee INT,
                              prix_unitaire DECIMAL(10, 2) -- Utilisez DECIMAL pour les valeurs monétaires
);

-- Table des Voitures
CREATE TABLE Cars (
                      carID SERIAL PRIMARY KEY,
                      nom_modele VARCHAR(100),
                      annee_fabrication INT,
                      prix_unitaire DECIMAL(10, 2),
                      quantite_en_stock INT
    -- Ajoutez d'autres colonnes pour les détails de la voiture
);

--insérer 20 voitures dans la table Cars avec leurs caractéristiques
INSERT INTO Cars (nom_modele, annee_fabrication, prix_unitaire, quantite_en_stock)
VALUES
    ('Modèle1', 2022, 25000, 5),
    ('Modèle2', 2023, 28000, 8),
    ('Modèle3', 2021, 22000, 10),
    ('Modèle4', 2020, 20000, 15),
    ('Modèle5', 2022, 27000, 7),
    ('Modèle6', 2023, 30000, 3),
    ('Modèle7', 2021, 23000, 12),
    ('Modèle8', 2020, 19000, 20),
    ('Modèle9', 2022, 26000, 6),
    ('Modèle10', 2023, 29000, 9),
    ('Modèle11', 2021, 21000, 13),
    ('Modèle12', 2020, 18000, 18),
    ('Modèle13', 2022, 24000, 4),
    ('Modèle14', 2023, 27000, 11),
    ('Modèle15', 2021, 20000, 16),
    ('Modèle16', 2020, 17000, 22),
    ('Modèle17', 2022, 25000, 5),
    ('Modèle18', 2023, 28000, 8),
    ('Modèle19', 2021, 22000, 10),
    ('Modèle20', 2020, 20000, 15);




-- Table de l'Histoire des Prix
CREATE TABLE PriceHistory (
                              priceHistoryID SERIAL PRIMARY KEY,
                              carID INT REFERENCES Cars(carID),
                              date_modification_prix TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              nouveau_prix DECIMAL(10, 2)
);
