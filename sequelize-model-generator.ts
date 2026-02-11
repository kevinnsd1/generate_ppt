
import SequelizeAuto from 'sequelize-auto';

const auto = new SequelizeAuto('itko_19', 'root', 'J4s4medik4', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  additional: {
    freezeTableName: true,
    timestamps: false,
    //...
  },
  // tables: ['iv_satker']
} as any);

const autoAny = auto as any;

autoAny.run(function (err: any) {
  if (err) throw err;

  console.log(autoAny.tables); // table list
  console.log(autoAny.foreignKeys); // foreign key list
});
