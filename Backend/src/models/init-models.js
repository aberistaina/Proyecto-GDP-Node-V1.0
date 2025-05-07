import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Aprobadores from  "./Aprobadores.js";
import _ArchivosComentariosVersionProceso from  "./ArchivosComentariosVersionProceso.js";
import _ArchivosOportunidadesMejora from  "./ArchivosOportunidadesMejora.js";
import _ArchivosVersionProceso from  "./ArchivosVersionProceso.js";
import _BitacoraAprobaciones from  "./BitacoraAprobaciones.js";
import _Cargo from  "./Cargo.js";
import _ComentariosVersionProceso from  "./ComentariosVersionProceso.js";
import _IntermediaProcesos from  "./IntermediaProcesos.js";
import _Niveles from  "./Niveles.js";
import _OportunidadesMejora from  "./OportunidadesMejora.js";
import _Procesos from  "./Procesos.js";
import _Roles from  "./Roles.js";
import _Token from  "./Token.js";
import _Usuarios from  "./Usuarios.js";
import _VersionProceso from  "./VersionProceso.js";

export default function initModels(sequelize) {
  const Aprobadores = _Aprobadores.init(sequelize, DataTypes);
  const ArchivosComentariosVersionProceso = _ArchivosComentariosVersionProceso.init(sequelize, DataTypes);
  const ArchivosOportunidadesMejora = _ArchivosOportunidadesMejora.init(sequelize, DataTypes);
  const ArchivosVersionProceso = _ArchivosVersionProceso.init(sequelize, DataTypes);
  const BitacoraAprobaciones = _BitacoraAprobaciones.init(sequelize, DataTypes);
  const Cargo = _Cargo.init(sequelize, DataTypes);
  const ComentariosVersionProceso = _ComentariosVersionProceso.init(sequelize, DataTypes);
  const IntermediaProcesos = _IntermediaProcesos.init(sequelize, DataTypes);
  const Niveles = _Niveles.init(sequelize, DataTypes);
  const OportunidadesMejora = _OportunidadesMejora.init(sequelize, DataTypes);
  const Procesos = _Procesos.init(sequelize, DataTypes);
  const Roles = _Roles.init(sequelize, DataTypes);
  const Token = _Token.init(sequelize, DataTypes);
  const Usuarios = _Usuarios.init(sequelize, DataTypes);
  const VersionProceso = _VersionProceso.init(sequelize, DataTypes);

  Aprobadores.belongsToMany(VersionProceso, { as: 'id_version_proceso_version_procesos', through: BitacoraAprobaciones, foreignKey: "id_aprobador", otherKey: "id_version_proceso" });
  VersionProceso.belongsToMany(Aprobadores, { as: 'id_aprobador_aprobadores', through: BitacoraAprobaciones, foreignKey: "id_version_proceso", otherKey: "id_aprobador" });
  BitacoraAprobaciones.belongsTo(Aprobadores, { as: "id_aprobador_aprobadore", foreignKey: "id_aprobador"});
  Aprobadores.hasMany(BitacoraAprobaciones, { as: "bitacora_aprobaciones", foreignKey: "id_aprobador"});
  VersionProceso.belongsTo(Aprobadores, { as: "id_aprobador_aprobadore", foreignKey: "id_aprobador"});
  Aprobadores.hasMany(VersionProceso, { as: "version_procesos", foreignKey: "id_aprobador"});
  Procesos.belongsTo(Cargo, { as: "id_aprobadores_cargo_cargo", foreignKey: "id_aprobadores_cargo"});
  Cargo.hasMany(Procesos, { as: "procesos", foreignKey: "id_aprobadores_cargo"});
  Usuarios.belongsTo(Cargo, { as: "id_cargo_cargo", foreignKey: "id_cargo"});
  Cargo.hasMany(Usuarios, { as: "usuarios", foreignKey: "id_cargo"});
  ArchivosComentariosVersionProceso.belongsTo(ComentariosVersionProceso, { as: "id_comentario_comentarios_version_proceso", foreignKey: "id_comentario"});
  ComentariosVersionProceso.hasMany(ArchivosComentariosVersionProceso, { as: "archivos_comentarios_version_procesos", foreignKey: "id_comentario"});
  Procesos.belongsTo(Niveles, { as: "id_nivel_nivele", foreignKey: "id_nivel"});
  Niveles.hasMany(Procesos, { as: "procesos", foreignKey: "id_nivel"});
  ArchivosOportunidadesMejora.belongsTo(OportunidadesMejora, { as: "id_oportunidad_oportunidades_mejora", foreignKey: "id_oportunidad"});
  OportunidadesMejora.hasMany(ArchivosOportunidadesMejora, { as: "archivos_oportunidades_mejoras", foreignKey: "id_oportunidad"});
  IntermediaProcesos.belongsTo(Procesos, { as: "id_bpmn_proceso", foreignKey: "id_bpmn"});
  Procesos.hasMany(IntermediaProcesos, { as: "intermedia_procesos", foreignKey: "id_bpmn"});
  IntermediaProcesos.belongsTo(Procesos, { as: "id_bpmn_padre_proceso", foreignKey: "id_bpmn_padre"});
  Procesos.hasMany(IntermediaProcesos, { as: "id_bpmn_padre_intermedia_procesos", foreignKey: "id_bpmn_padre"});
  VersionProceso.belongsTo(Procesos, { as: "id_proceso_proceso", foreignKey: "id_proceso"});
  Procesos.hasMany(VersionProceso, { as: "version_procesos", foreignKey: "id_proceso"});
  Usuarios.belongsTo(Roles, { as: "id_rol_role", foreignKey: "id_rol"});
  Roles.hasMany(Usuarios, { as: "usuarios", foreignKey: "id_rol"});
  Aprobadores.belongsTo(Usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  Usuarios.hasMany(Aprobadores, { as: "aprobadores", foreignKey: "id_usuario"});
  ArchivosVersionProceso.belongsTo(Usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  Usuarios.hasMany(ArchivosVersionProceso, { as: "archivos_version_procesos", foreignKey: "id_usuario"});
  ComentariosVersionProceso.belongsTo(Usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  Usuarios.hasMany(ComentariosVersionProceso, { as: "comentarios_version_procesos", foreignKey: "id_usuario"});
  OportunidadesMejora.belongsTo(Usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  Usuarios.hasMany(OportunidadesMejora, { as: "oportunidades_mejoras", foreignKey: "id_usuario"});
  Procesos.belongsTo(Usuarios, { as: "id_creador_usuario", foreignKey: "id_creador"});
  Usuarios.hasMany(Procesos, { as: "procesos", foreignKey: "id_creador"});
  Token.belongsTo(Usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  Usuarios.hasMany(Token, { as: "tokens", foreignKey: "id_usuario"});
  Usuarios.belongsTo(Usuarios, { as: "id_jefe_directo_usuario", foreignKey: "id_jefe_directo"});
  Usuarios.hasMany(Usuarios, { as: "usuarios", foreignKey: "id_jefe_directo"});
  VersionProceso.belongsTo(Usuarios, { as: "id_creador_usuario", foreignKey: "id_creador"});
  Usuarios.hasMany(VersionProceso, { as: "version_procesos", foreignKey: "id_creador"});
  ArchivosVersionProceso.belongsTo(VersionProceso, { as: "id_version_proceso_version_proceso", foreignKey: "id_version_proceso"});
  VersionProceso.hasMany(ArchivosVersionProceso, { as: "archivos_version_procesos", foreignKey: "id_version_proceso"});
  BitacoraAprobaciones.belongsTo(VersionProceso, { as: "id_version_proceso_version_proceso", foreignKey: "id_version_proceso"});
  VersionProceso.hasMany(BitacoraAprobaciones, { as: "bitacora_aprobaciones", foreignKey: "id_version_proceso"});
  ComentariosVersionProceso.belongsTo(VersionProceso, { as: "id_version_proceso_version_proceso", foreignKey: "id_version_proceso"});
  VersionProceso.hasMany(ComentariosVersionProceso, { as: "comentarios_version_procesos", foreignKey: "id_version_proceso"});
  OportunidadesMejora.belongsTo(VersionProceso, { as: "id_version_proceso_version_proceso", foreignKey: "id_version_proceso"});
  VersionProceso.hasMany(OportunidadesMejora, { as: "oportunidades_mejoras", foreignKey: "id_version_proceso"});

  return {
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
    Token,
    Usuarios,
    VersionProceso,
  };
}
