class AllocationService {
    constructor(db) {
      this.db = db;
    }
    async getTrackById(uid) {
      const sql = `SELECT * FROM employee_track
      WHERE employee_track_id = ?`;
  
      return new Promise((resolve, reject) => {
        this.db.query(sql, uid, (err, result) => {
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
    async deleteTrackById(uid) {
      return new Promise((resolve, reject) => {
        const sql = ` UPDATE employee_track 
        SET is_active="0" WHERE employee_track_id = ?`;
        this.db.query(sql, [uid], (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      }).then(resp => resp);
    }
    async getVehicleById(uid) {
      const sql = `SELECT * FROM employee_vehicle
      WHERE employee_vehicle_id = ?`;
  
      return new Promise((resolve, reject) => {
        this.db.query(sql, uid, (err, result) => {
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
    async deleteVehicleById(uid) {
      return new Promise((resolve, reject) => {
        const sql = ` UPDATE employee_vehicle 
        SET is_active="0" WHERE employee_vehicle_id = ?`;
        this.db.query(sql, [uid], (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      }).then(resp => resp);
    }
    async getBinById(uid) {
      const sql = `SELECT * FROM track_bin
      WHERE track_bin_id = ?`;
  
      return new Promise((resolve, reject) => {
        this.db.query(sql, uid, (err, result) => {
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
    async deleteBinById(uid) {
      return new Promise((resolve, reject) => {
        const sql = ` UPDATE track_bin 
        SET is_active="0" WHERE track_bin_id = ?`;
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

module.exports = AllocationService;