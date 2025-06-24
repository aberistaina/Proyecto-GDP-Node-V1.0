import initModels from "./init-models.js";
import { sequelize } from "../database/database.js";

const models = initModels(sequelize);

export const { 
  Aprobadores, 
  ArchivosComentariosVersionProceso, 
  ArchivosOportunidadesMejora, 
  ArchivosVersionProceso, 
  BitacoraAprobaciones, 
  Cargo, 
  ComentariosVersionProceso, 
  IntermediaProcesos, 
  Niveles, 
  OportunidadesMejora, 
  Procesos, 
  Roles, 
  Usuarios, 
  VersionProceso,
  Token,
  Administracion,
  ProcesosAprobadores
} = models;

export default models;
