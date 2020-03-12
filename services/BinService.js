class BinService {
  constructor(db) {
    this.db = db;
  }

  async getBins() {
    const sql = `SELECT * FROM bins WHERE is_active=TRUE`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async getBinById(uid) {
    const sql = `SELECT * FROM bins WHERE bin_id = ? AND is_active=TRUE`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, [uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => {
      return resp.length === 0 ? null : resp[0];
    });
  }

  async addNewBin(data) {
    const binData = {
      bin_id: data.bin_id,
      bin_address: data.bin_address,
      latitude: data.latitude,
      longitude: data.longitude,
      image: data.image,
      remarks: data.remarks,
      is_active: true,
      created_by: data.employee_id,
      created_at: new Date(),
    };

    return new Promise((resolve, reject) => {
      this.db.query('INSERT INTO bins SET ?', binData, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    })
      .then(resp => resp)
      .catch(error => error);
  }

  async deleteBinById(uid) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE vehicle SET is_active=FALSE WHERE vehicle_id = ?`;
      this.db.query(sql, [uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }
}

module.exports = BinService;
