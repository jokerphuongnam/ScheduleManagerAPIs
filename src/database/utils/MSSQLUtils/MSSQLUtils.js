import {
    Request,
    Connection
} from 'tedious'
import configure from './configure.json'

class MSSQLUtils {
    Config = {}
    constructor() {
        this.config = configure;
    }

    getRequest(sqlQuery, callback = () => {}) {
        return new Request(sqlQuery, callback);
    }

    open() {
        return new Promise((resolve, reject) => {
            const conn = new Connection(this.config)
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
}

const msSqlUtils = new MSSQLUtils()

export default msSqlUtils