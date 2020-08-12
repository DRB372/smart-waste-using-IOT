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
    console.log(data);
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
      const sql = `UPDATE bins SET is_active=FALSE WHERE bin_id = ?`;
      this.db.query(sql, [uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async updateBinById(uid, data) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE bins SET ? WHERE bin_id = ? AND is_active=TRUE`;
      this.db.query(sql, [data, uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async addLevelBin(data) {

    return new Promise((resolve, reject) => {
      console.log(data.Distance);
      const sql = 'UPDATE bins SET level =?  WHERE bin_id=1122';
      this.db.query(sql, [data.Distance], (err, result) => {
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

 
}

module.exports = BinService;
