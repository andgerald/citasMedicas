const express = require("express");
const chalk = require("chalk");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");
const app = express();
const uuid = require("uuid");

const PORT = 3000;
// Ruta para obtener datos de Mindicador API

app.get("/usuarios", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=11");
    const usuario = response.data.results;
    const usuarios = _.map(usuario, (user) => {
      //agregar el id y  lo limitamos a solo 6 caracteres
      user.Id = uuid.v4().slice(0, 6);
      //agregamos la fecha
      user.Timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      return {
        Gender: user.gender,
        Nombre: user.name.first,
        Apellido: user.name.last,
        Id: user.Id,
        Timestamp: user.Timestamp,
      };
    });
    //Se separan hombres de mujeres
    const [men, women] = _.partition(usuarios, (sexo) => sexo.Gender == "male");

    //recorro las mujeres
    console.log("Mujeres:");
    _.forEach(women, (woman, i) => {
      console.log(
        chalk.blue.bgWhite(
          `${i + 1}. Nombre: ${woman.Nombre} - Apellido: ${
            woman.Apellido
          } - ID: ${woman.Id} - Timestamp: ${woman.Timestamp}`
        )
      );
    });

    //recorro los hombres
    console.log("Hombres:");
    _.forEach(men, (man, i) => {
      console.log(
        chalk.blue.bgWhite(
          `${i + 1}. Nombre: ${man.Nombre} - Apellido: ${man.Apellido} - ID: ${
            man.Id
          } - Timestamp: ${man.Timestamp}`
        )
      );
    });
    res.json(usuarios);
  } catch (error) {
    let mensaje = "";
    let estado = 0;
    if (error.code == "ERR_BAD_REQUEST") {
      console.log(
        "Error TRADUCIDO: ",
        "La solicitud falló con el código de estado 404"
      );
      mensaje = "La solicitud falló con el código de estado 404";
      estado = 404;
    } else {
      console.log(
        "Error TRADUCIDO: ",
        "No se puede acceder al sitio: " + error.config.url
      );
      mensaje = "No se puede acceder al sitio: " + error.config.url;
      estado = 500;
    }
    res.status(estado).json({ error: mensaje });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
