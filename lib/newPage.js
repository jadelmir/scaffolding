const prompt = require('prompt');
const shell = require('shelljs');
const fs = require('fs');
const colors = require("colors/safe");

// Set prompt as green and use the "Replace" text
prompt.message = colors.green("Replace");


function copyFiles(templatePath,srcPath,logger) {
    if(fs.existsSync(templatePath)){
        logger.info('copying files ...')
        shell.cp('-R',`${templatePath}/*`,srcPath)
        logger.info(' The files have been copied!');
    }else {
        logger.error(`The requested template  wasn't found.`)
        process.exit(1);
      }
}

function changeFileName(logger ,srcPath , fileName ) {
    let newFilePathName = srcPath+'/'+fileName+'.js'
    let oldfilePath = srcPath+'/index.js'
    fs.renameSync(oldfilePath, newFilePathName);
    console.log('File Renamed.');
}

function changeFolderName(logger , folderName,PageSrc){
    let newFolderPath = PageSrc+'/'+folderName+'/'
    let oldFolderPath = PageSrc+'/'+'newPage/'
    fs.renameSync(oldFolderPath, newFolderPath);
    console.log('Folder Renamed.');
    return newFolderPath
}

module.exports = (args, options, logger) => {
    const templatePath = `${__dirname}/../templates/react`;
    const localPath = process.cwd();
    const srcPath = localPath+'/src/container'
    const variables = require(`${templatePath}/newPage/_variables`);
    const reducerPath = localPath + '/src/reducers/index.js'
    var fileName = null
    var PageSrc = null
    logger.info('templatePath',templatePath)

        copyFiles(templatePath , srcPath,logger)

  


          logger.info('Please fill the following values…');
          prompt.start().get(variables,(err,result)=>{
              logger.info('variables',result)
              fileName = result.fileName
              folderName = result.fileName
               PageSrc = changeFolderName(logger,result.fileName,srcPath)
            console.log('pageSRc is',PageSrc);
            
            shell.ls('-Rl', PageSrc).forEach(entry => {

                variables.forEach(variable => {
                    console.log('variable to upper case is ',variable.toUpperCase());
                    console.log('result name is',result[variable]+"Reducer" ,"and entry name", entry.name);
                    
                    shell.sed('-i', `\\[${variable.toUpperCase()}\\]`, result[variable]+"Reducer", PageSrc+'/'+entry.name);
                  });

                // if(entry.name == 'index.js') changeFileName(logger,PageSrc,result.fileName)


              });

              var reducer = fs.readFileSync(reducerPath,'utf8').toString().split('\n')
              var importAdded = false 
              var exportAdded = false
              var importPath = '../container/'+folderName+'/reducer.js'
              var reducerName = folderName+'Reducer'
              var importString = 'import '+reducerName+' from \''+importPath+'\''
              for(line in reducer) {
                  
                if(reducer[line].includes("import") && !importAdded){
                    importAdded=true
                  reducer.splice(Number(line)+1,0 , importString)
                  
                }
                if(reducer[line].includes("export default") && !exportAdded){
                    exportAdded=true 
                    reducer.splice(Number(line)+1,0 , reducerName+',')
               
                    
                     
                }
                    
            }
            let newFile =reducer.join('\n')

            
            fs.writeFileSync(reducerPath,newFile)
            
      

          })

         
        
    }
    

    