1) Abrimos Command Prompt
docker ps
<!-- Salida -->
CONTAINER ID   IMAGE                                           CREATED         STATUS         PORTS                           NAMES
1e4721142002   node-postgres-docker-compose_devcontainer_app   5 minutes ago   Up 5 minutes                               node-postgres-docker-compose_devcontainer_app_1
e407aa67c959   postgres:latest                                 5 minutes ago   Up 5 minutes   5432/tcp   node-postgres-docker-compose_devcontainer_db_1
 
2) Copiar el <Container-ID> de postgres, en este caso e407aa67c959
3) Pegamos el siguiente comando en CMD, para ingresar a la terminal dentro del contenedor de forma interactiva
docker exec -it <CONTAINER-ID> bash
<!-- ejemplo -->
docker exec -it e407aa67c959 bash 
<!-- salida -->
root@e407aa67c959:/#
4) Ingresar a la base de datos usando las variables definidas en docker-compose.yml
POSTGRES_PASSWORD: postgres
POSTGRES_USER: postgres
POSTGRES_DB: postgres
<!-- Ejecutar -->
psql -U <POSTGRES_USER> -d <POSTGRES_DB>
<!-- ejemplo -->
psql -U postgres -d postgres 
<!-- salida -->
postgres=# 
5) Ahora ya estamos dentro de la base de datos y podemos ejecutar el script  
almacenado en script.sql
<!-- para ver la base de datos -->
\l 
<!-- para seleccionar la base de datos postgres -->
\c postgres
<!-- crear tabla -->
CREATE TABLE Employee( 
        id int not null, 
        name text not null, 
        rollnumber int not null
        );
<!-- ver lista de tablas de la base de datos seleccionada -->
\dt
<!-- crear registro -->
INSERT INTO Employee values(1,'John',1001);
<!-- comprobar que se agrego -->
select * from Employee;
<!-- salir de postgres -->
\q
6) salir de terminal dentro del contenedor
exit
7) cerrar CMD
exit
8) ejecutar en la terminal dentro del proyecto en vs code
nodemon server.js

