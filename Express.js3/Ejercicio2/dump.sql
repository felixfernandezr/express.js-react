CREATE USER 'uces'@'localhost' IDENTIFIED BY 'uces';
GRANT USAGE ON *.* TO 'uces'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
CREATE DATABASE IF NOT EXISTS `express3`;GRANT ALL PRIVILEGES ON `uces`.* TO 'uces'@'localhost';
USE express3;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `email` varchar(250) NOT NULL,
  `clave` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_hora` DATETIME NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `invitados` (
  `id_evento` int(11) NOT NULL,
  `id_invitado` int(11) NOT NULL,
  FOREIGN KEY (id_evento) REFERENCES eventos(id),
  FOREIGN KEY (id_invitado) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `clave`) VALUES
(1, 'Florencia Morelli', 'fmorelli@mail.com', 'abc123'),
(2, 'Santiago Fazzini', 'sfazzini@mail.com', 'def456'),
(3, 'Fèlix Fernàndez', 'ffernandez@mail.com', 'ghi789'),
(4, 'Admin Administra', 'admin@mail.com', 'soyadmin');

INSERT INTO `eventos` (`id`, `id_usuario`, `fecha_hora`, `titulo`, `descripcion`) VALUES
(1, 1, NOW(), 'Cumpleaños', 'Fiesta de cumpleaños en salón'),
(2, 2, NOW(), 'Casamiento', 'Fiesta de casamiento en salón'),
(3, 1, NOW(), 'Fiesta de 15', 'Fiesta de 15 en salón'),
(4, 3, NOW(), '50 Años', 'Fiesta de 50 en salón');

INSERT INTO `invitados` (`id_evento`, `id_invitado`) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 1),
(3, 2),
(3, 3);