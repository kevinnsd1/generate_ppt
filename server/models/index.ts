
// 'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Using require for config to ensure correct path resolution and object access
const config = require(__dirname + '/../config/config.json')[env];

const db: any = {};
let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' || file.slice(-3) === '.ts')
    );
  })
  .forEach((file) => {
    // Determine if we should use specialized import or require
    // For V5, import uses file path. For V6 it's deprecated. STICKING TO V5 pattern but with TS adjustments if needed.
    // However, sequelize.import is deprecated. Using require approach is safer for migration if import fails.
    // But since package.json says 5.21.11, import is valid.
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
module.exports = db; // Keep module.exports for backward compatibility for now
