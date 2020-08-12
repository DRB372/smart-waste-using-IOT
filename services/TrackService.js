class TrackService {
    constructor(db) {
      this.db = db;
    }
  
    async getTracks() {
      const sql = `SELECT * From track where is_active="1"`;
  
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
  
    async getTrackById(uid) {
      const sql = `SELECT * FROM track
      WHERE track_id = ?`;
  
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
  
    async addNewTrack(data) {
      const trackData = {
        track_name: data.track_name,
        description: data.description,
        created_at: new Date(),
      };
      
  return new Promise((resolve, reject) => {
        this.db.query('INSERT INTO track SET ?', trackData, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      });
    }
  
    async updateTrackById(uid, data) {
      return new Promise((resolve, reject) => {
        const sql = `UPDATE track
        SET ? WHERE track_id = ?`;
        this.db.query(sql, [data, uid], (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      }).then(resp => resp);
    }
  
    async deleteTrackById(uid) {
      return new Promise((resolve, reject) => {
        const sql = ` UPDATE track 
        SET is_active="0" WHERE track_id = ?`;
        this.db.query(sql, [uid], (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      }).then(resp => resp);
    }

    async assignBin(data) {
      const Data = {
        track_id: data.track_id,
        bin_id: data.bin_id,
        created_at: new Date(),
        is_active:true,
      };
     
  return new Promise((resolve, reject) => {
        this.db.query('INSERT INTO track_bin SET ?', Data, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      });
    }

    async getBinsByTrackId(uid) {
      const sql = `SELECT B.bin_id, B.bin_address,B.level, B.latitude ,B.longitude, T.track_bin_id FROM bins AS B
      JOIN track_bin AS T ON B.bin_id= T.bin_id where T.track_id= ? AND T.is_active=true;`;
  
      return new Promise((resolve, reject) => {
        this.db.query(sql, uid, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      })
    }

  }
  
  module.exports = TrackService;
  