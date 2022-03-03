const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const fs = require('fs/promises');
const accessSync = require('fs').accessSync;
const constants = require('fs').constants;

const express = require('express');
const app = express();

const path = require('path');
const fileURLToPath = require('url').fileURLToPath;

const port = 80;
const PROJECT_ROOT = path.resolve(__dirname);

const SCRIPTS_DIR = `${PROJECT_ROOT}/assets/scripts`;
const CONFIGURATION_FILES_DIR = `${PROJECT_ROOT}/assets/config`;
const TEMPLATE_FOLDER = `${PROJECT_ROOT}/assets/templates`;

app.use('/wishes/assets',express.static('assets'));

app.use('/wishes/:user', (req,res,next) => {  
  const configFilePath = `${CONFIGURATION_FILES_DIR}/${req.params['user']}.config.json`;

  if(!config_file_exists(configFilePath)){
    express.static(`${TEMPLATE_FOLDER}/default`)(req,res,next);
  }else{
    read_config_file(configFilePath)
    .then( (jsonData) => {
      express.static(`${TEMPLATE_FOLDER}/${jsonData.Template}`)(req,res,next);
    })
    .catch( (error) => res.send(error) );      
  }

});

app.get('/wishes/:user', (req, res) => {
  const configFilePath = `${CONFIGURATION_FILES_DIR}/${req.params['user']}.config.json`;
  
  if(!config_file_exists(configFilePath)){
    render_wish_template(configFilePath,req.params['user'])
    .then( (result) => res.send(result) )
    .catch( (error) => res.send(error) );
  }else{
    render_wish_template(configFilePath)
    .then( (result) => res.send(result) )
    .catch( (error) => res.send(error) );
  }

});

function config_file_exists(configFilePath){
  let configFileExists = true;
  try{
    accessSync(configFilePath,constants.F_OK);
  }catch (error){
    configFileExists = false;
  }
  return configFileExists;
}

function read_config_file(configFilePath){
  return new Promise(function(resolve,reject){
    fs.readFile(configFilePath)  
    .then( function(result){
      let jsonData = JSON.parse(result.toString());
      resolve(jsonData);
    })
    .catch(function(error){
      reject(error);
    });
  });
}

function render_wish_template(configFilePath,userName=null){
  const renderWishes = `${SCRIPTS_DIR}/dma.theywishes/src/theywishes/render_they_wishes.py`;
  
  let params;
  if(userName!==null){
      params = [`${CONFIGURATION_FILES_DIR}/guest.config.json`,"--from-user-name",userName,"--template-folder",TEMPLATE_FOLDER];
  }else{
      params = [configFilePath,"--template-folder",TEMPLATE_FOLDER];
  }

  return new Promise( function(resolve,reject){
      execFile(renderWishes, params)
      .then(result => {
        resolve(result.stdout);
      })
      .catch( (error) => reject(error) );
  });
}


//Not able to make it work inside a container when specifying the hostname
app.listen(port, () => {
  console.log(`Server running at http://localhost`);
});


