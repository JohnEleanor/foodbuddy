-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for foodbuddy
CREATE DATABASE IF NOT EXISTS `foodbuddy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `foodbuddy`;

-- Dumping structure for table foodbuddy.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_age` int(11) NOT NULL,
  `user_weight` int(25) NOT NULL,
  `user_height` int(25) NOT NULL,
  `user_gender` varchar(255) NOT NULL,
  `user_bmi` int(25) NOT NULL,
  `user_lifestyle` varchar(255) NOT NULL,
  `user_target` varchar(255) NOT NULL,
  `user_targetweight` int(100) NOT NULL,
  `user_disease` varchar(255) NOT NULL,
  `user_foodallery` varchar(255) NOT NULL,
  `user_displayName` varchar(255) NOT NULL,
  `user_lineId` varchar(255) NOT NULL,
  `user_pictureUrl` varchar(255) NOT NULL,
  `user_dailycalories` int(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table foodbuddy.users: ~2 rows (approximately)
REPLACE INTO `users` (`user_id`, `user_name`, `user_age`, `user_weight`, `user_height`, `user_gender`, `user_bmi`, `user_lifestyle`, `user_target`, `user_targetweight`, `user_disease`, `user_foodallery`, `user_displayName`, `user_lineId`, `user_pictureUrl`, `user_dailycalories`) VALUES
	(20, 'เจ', 24, 55, 167, 'male', 20, 'sedentary', 'เพิ่มน้ำหนัก', 61, 'ไม่มี', 'ไม่มี', 'AmJ', 'xxxx', 'https://profile.line-scdn.net/0hAnpfNiNMHkFdHw8ZGbtgPi1PHSt-bkdTeHlVLzsdSCQ0ewxAI3xZdG1KFCM1el0WIilUIztMSXNRDGknQ0nidVovQ3BhKF0XeXBYow', 2289);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
