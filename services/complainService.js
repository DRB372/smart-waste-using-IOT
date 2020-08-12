class ComplainService {
    constructor(db) {
      this.db = db;
    }

    async getComplains() {
        const sql = `SELECT * From complains where is_active=true`;
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
      async getComplainById(uid) {
        const sql = `SELECT * FROM complains
        WHERE id = ?`;
    
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
      async deleteComplainById(uid) {
        return new Promise((resolve, reject) => {
          const sql = ` UPDATE complains 
          SET is_active="0" WHERE id = ?`;
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


module.exports = ComplainService;