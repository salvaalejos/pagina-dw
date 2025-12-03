-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: bubble_tea
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bebidas`
--

DROP TABLE IF EXISTS `bebidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bebidas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `precio` double NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `imagen` text,
  `id_sucursal` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bebidas_sucursales` (`id_sucursal`),
  CONSTRAINT `fk_bebidas_sucursales` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bebidas`
--

LOCK TABLES `bebidas` WRITE;
/*!40000 ALTER TABLE `bebidas` DISABLE KEYS */;
INSERT INTO `bebidas` VALUES (4,'Iced Coffee',22,'Café frío con un toque de leche','https://images.unsplash.com/photo-1509042239860-f550ce710b93',2),(5,'Lemonade',12.99,'Clásica limonada casera','https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg',2),(6,'Blueberry Shake',20.75,'Batido cremoso de arándanos','https://images.pexels.com/photos/5946638/pexels-photo-5946638.jpeg',2),(7,'Green Tea',10.5,'Té verde helado y saludable','https://images.pexels.com/photos/230491/pexels-photo-230491.jpeg',2),(8,'Chocolate Milkshake',25,'Malteada espesa de chocolate','https://images.unsplash.com/photo-1572490122747-3968b75cc699',2),(10,'Banana',33,'Bebida de plátano','https://png.pngtree.com/png-vector/20231127/ourlarge/pngtree-delicious-banana-milkshake-tasty-png-image_10723305.png',1),(11,'Banana Split',1000,'Deiliciosa Banana Split, barata','https://tse1.explicit.bing.net/th/id/OIP.dKNcftjRzpUIl79QVlntvAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',1);
/*!40000 ALTER TABLE `bebidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario` varchar(100) DEFAULT 'Sistema',
  `accion` varchar(50) NOT NULL,
  `detalle` text,
  `ip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
INSERT INTO `bitacora` VALUES (1,'2025-11-19 17:30:47','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(2,'2025-11-19 17:38:16','admin','ADMIN_CREATE_USER','Creó usuario: salvador (Rol: cliente)','127.0.0.1'),(3,'2025-11-19 17:38:34','admin','ADMIN_DELETE_USER','Eliminó usuario ID: 5','127.0.0.1'),(4,'2025-11-19 17:38:49','admin','DELETE_PRODUCT','Producto eliminado ID: 1','127.0.0.1'),(5,'2025-11-19 17:45:02','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(6,'2025-11-19 17:45:24','admin','LOGOUT','Cierre de sesión','127.0.0.1'),(7,'2025-11-19 17:45:55','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(8,'2025-11-19 17:53:03','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(9,'2025-11-19 18:42:13','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(10,'2025-11-19 18:42:20','admin','DB_BACKUP','Descarga de respaldo SQL','127.0.0.1'),(11,'2025-11-19 18:57:00','admin','DB_BACKUP','Descarga de respaldo SQL','127.0.0.1'),(12,'2025-11-26 17:37:51','admin','LOGIN_FAIL','Credenciales incorrectas','127.0.0.1'),(13,'2025-11-26 17:38:11','admin','LOGIN_FAIL','Credenciales incorrectas','127.0.0.1'),(14,'2025-11-26 17:38:45','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(15,'2025-11-26 17:44:43','admin','ADD_PRODUCT','Nuevo producto: Banana Split (Sucursal 1)','127.0.0.1'),(16,'2025-11-26 17:45:41','admin','DB_BACKUP','Descarga de respaldo SQL','127.0.0.1'),(17,'2025-11-26 17:46:47','admin','LOGOUT','Cierre de sesión','127.0.0.1'),(18,'2025-11-26 17:47:03','cliente1','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(19,'2025-11-26 17:49:37','cliente1','NEW_ORDER','Pedido por $1066 en Sucursal 1','127.0.0.1'),(20,'2025-11-26 17:49:54','cliente1','LOGOUT','Cierre de sesión','127.0.0.1'),(21,'2025-11-26 17:51:47','tadeo','REGISTER','Nuevo usuario registrado','127.0.0.1'),(22,'2025-11-26 17:52:06','tadeo','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(23,'2025-11-26 17:52:19','tadeo','LOGOUT','Cierre de sesión','127.0.0.1'),(24,'2025-11-26 17:52:52','tadeo','LOGIN','Inicio de sesión exitoso','127.0.0.1'),(25,'2025-11-26 17:53:00','tadeo','NEW_ORDER','Pedido por $35.5 en Sucursal 2','127.0.0.1'),(26,'2025-11-27 17:13:49','admin','LOGIN','Inicio de sesión exitoso','127.0.0.1');
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,'Salvador','{comment.email}','{comment.message}');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_bebidas`
--

DROP TABLE IF EXISTS `pedido_bebidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_bebidas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `bebida_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `precio_unitario` decimal(8,2) NOT NULL COMMENT 'Precio al momento de la compra',
  PRIMARY KEY (`id`),
  KEY `fk_pedidobebida_pedidos_idx` (`pedido_id`),
  KEY `fk_pedidobebida_bebidas_idx` (`bebida_id`),
  CONSTRAINT `fk_pedidobebida_bebidas` FOREIGN KEY (`bebida_id`) REFERENCES `bebidas` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pedidobebida_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_bebidas`
--

LOCK TABLES `pedido_bebidas` WRITE;
/*!40000 ALTER TABLE `pedido_bebidas` DISABLE KEYS */;
INSERT INTO `pedido_bebidas` VALUES (1,1,6,2,20.75),(2,1,7,3,10.50),(3,2,6,2,20.75),(4,2,8,1,25.00),(5,2,4,3,22.00),(6,3,4,1,22.00),(7,3,7,1,10.50),(8,4,10,2,33.00),(9,5,5,1,12.99),(10,5,4,1,22.00),(13,7,10,2,33.00),(14,7,11,1,1000.00),(15,8,7,1,10.50),(16,8,8,1,25.00);
/*!40000 ALTER TABLE `pedido_bebidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(8,2) DEFAULT '0.00',
  `sucursal_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `fk_pedidos_usuarios_idx` (`user_id`),
  CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,2,'2025-11-17 05:19:59',73.00,2),(2,2,'2025-11-17 06:54:45',132.50,2),(3,2,'2025-11-18 14:35:33',32.50,2),(4,2,'2025-11-18 17:34:18',66.00,1),(5,2,'2025-11-18 17:36:54',34.99,2),(7,2,'2025-11-26 17:49:37',1066.00,1),(8,8,'2025-11-26 17:53:00',35.50,2);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursales`
--

DROP TABLE IF EXISTS `sucursales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursales`
--

LOCK TABLES `sucursales` WRITE;
/*!40000 ALTER TABLE `sucursales` DISABLE KEYS */;
INSERT INTO `sucursales` VALUES (1,'Centro','Bartolomé de Las Casas 305-A, Morelia','4433157885'),(2,'Boulevard','Blvd. García de León 1162-2, Nva. Chapultepec Sur, Morelia','4433157885'),(3,'Plaza U','Av. Universidad 1755-Local 31, Fracc. Real, Morelia','4433157885'),(5,'Tijeras','Av Universodad','4381126867');
/*!40000 ALTER TABLE `sucursales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `usuario` varchar(45) NOT NULL,
  `id_sucursal` int DEFAULT NULL,
  `rol` varchar(45) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuarios_sucursales` (`id_sucursal`),
  CONSTRAINT `fk_usuarios_sucursales` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador',NULL,'admin',NULL,'admin','scrypt:32768:8:1$H9KfYaQLC9k2Xiwc$4600090aa025e584024013091346e4d987274e2072f8f2fa700937d6cd2f5a1b4efab92c2421d3a1bbfa639a963057921e5c921b24e8f346b54cc41d68a2b130'),(2,'Cliente de Prueba','cliente@prueba.com','cliente1',NULL,'cliente','scrypt:32768:8:1$jSqdW0LPaPUJ3Ocx$c7ee70f25b60028d2de4d02c74aa1b49500050dfed8200deb7db423bf5919910d81e400d08f16bc136fa4510a5d3ec8d92c9964af0ff1a6a4ab587a540639009'),(3,'Usuario Sucursal Boulevard',NULL,'sucursal_boulevard',2,'sucursal','scrypt:32768:8:1$6QEMZn2ozAYBD2Pg$9acc31cf08542114753ed875940bda45103a89d32ea16d02329916fff7dd409c0593464082f675adae89d562a591304ed5ec8b056fa53216df9329f76be99624'),(4,'Centro','sucursal_centro@gmail.com','centro',1,'sucursal','scrypt:32768:8:1$yNwagAn6Ol1BGfEm$0a2b73ad5c05c42424bcedc43fbe15d264d220d4a8dea4ca547a18c7fb44e90a6f0d88c847ae7dae996cbf2b6ce022ea7192877f31b9cb0ce24f15786f918938'),(8,'Tadeo','tadeo123@gmail.com','tadeo',NULL,'cliente','scrypt:32768:8:1$EaxEHDwKCf1NzO26$52cc1de6898a4ac85cc401e5c5eec14ea5f6f61b8caeb366d6e9ecd3593244d4a94f4c6eca3c3b78563d1d52468f48abcbe323d7d394d6455157cec53e83f5c4');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 11:13:58
