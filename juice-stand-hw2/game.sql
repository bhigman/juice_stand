CREATE TABLE `game` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stand_name` varchar(255) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `game_date` date DEFAULT NULL,
  `game_time` time DEFAULT NULL,
  `fruit` int(11) DEFAULT NULL,
  `juice` double DEFAULT NULL,
  `customers` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;

INSERT INTO `game` (`id`, `stand_name`, `balance`, `price`, `game_date`, `game_time`, `fruit`, `juice`, `customers`)
VALUES
	(1,'Octopod Juice Co',20,0.75,'2014-05-31','21:06:00',30,18.75,3),
	(2,'Octopod Juice Co',20,0.75,'2014-05-31','09:15:00',30,18.75,3);

/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;
