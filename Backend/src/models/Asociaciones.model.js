import { Usuario } from "./Usuario.model.js";
import { Empresa } from "./Empresa.model.js";
import { Rol } from "./Rol.model.js";
import { Procesos } from './Procesos.model.js';
import { CallActivity } from './CallActivity.model.js';

// Asociación Usuario/Empresa
Usuario.belongsTo(Empresa, {
    foreignKey: "id_empresa",
    as: "empresa",
});

// Asociación Empresa/Usuario
Empresa.hasMany(Usuario, {
    foreignKey: "id_empresa",
    as: "usuarios",
});

// Asociación Usuario/Rol
Usuario.belongsTo(Rol, {
    foreignKey: "id_rol",
    as: "roles",
});

// Asociación Rol/Usuario
Rol.hasMany(Usuario, {
    foreignKey: "id_rol",
    as: "usuarios",
});

//  1. Un proceso puede tener muchos CallActivitys 
Procesos.hasMany(CallActivity, {
    foreignKey: 'idProceso',
    as: 'llamadasSubprocesos'
  });
  
  //  2. Un subproceso puede ser llamado en muchos CallActivitys
  Procesos.hasMany(CallActivity, {
    foreignKey: 'idSubProceso',
    as: 'referenciasComoSubproceso'
  });
  
  //  3. Cada CallActivity pertenece a un proceso padre
  CallActivity.belongsTo(Procesos, {
    foreignKey: 'idProceso',
    as: 'procesoPadre'
  });
  
  // 4. Cada CallActivity también pertenece a un subproceso
  CallActivity.belongsTo(Procesos, {
    foreignKey: 'idSubProceso',
    as: 'subproceso'
  });
  