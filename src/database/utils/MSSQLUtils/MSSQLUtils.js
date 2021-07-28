const {
    Request,
    Connection
} = require('tedious')
const configure = require('./configure.json') 

function MSSQLUtils(configureParam) {
    const config = configureParam ? configureParam : configure

    return new class {
        getRequest(sqlQuery, callback = () => {}) {
            return new Request(sqlQuery, callback);
        }
    
        open() {
            return new Promise((resolve, reject) => {
                const conn = new Connection(config)
                conn.connect(function (err) {
                    // If no error, then good to proceed.
                    if (err) {
                        reject(err)
                    } else {
                        // console.log("----db Connected");
                        resolve(conn)
                    }
                })
            })
        }
    
        execute(sqlQuery) {
            return new Promise(async (resolve, reject) => {
                const conn = await this.open();
                let error = undefined
                const request = this.getRequest(sqlQuery, (err) => {
                    error = err
                });
                const array = []
                request.on("row", (columns) => {
                    const data = {}
                    columns.forEach((column) => {
                        data[column.metadata.colName] = column.value;
                    });
                    array.push(data)
                });
                request.on("error", (err) => {
                    conn.close()
                    reject(err)
                    error = err
                });
                request.on("done", function (rowCount, more) {});
                request.on("requestCompleted", function () {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(array)
                    }
                    conn.close()
                });
                conn.execSql(request)
            });
        }
    }()
}

const msSqlUtils = MSSQLUtils()

module.exports = msSqlUtils