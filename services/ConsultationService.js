class ConsultationService {
    constructor(db) {
      this.db = db;
    }

    async getConsultation() {
        const sql = `SELECT * From consultations where is_active=true`;
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
      async getConsultationById(uid) {
        const sql = `SELECT * FROM consultations
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
      async deleteConsultationById(uid) {
        return new Promise((resolve, reject) => {
          const sql = ` UPDATE consultations 
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


module.exports = ConsultationService;