/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: { type: 'varchar(50)', primaryKey: true },
    filename: { type: 'varchar(255)', notNull: true },
    originalname: { type: 'varchar(255)', notNull: true },
    mimetype: { type: 'varchar(100)', notNull: true },
    size: { type: 'integer', notNull: true },
    path: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};
