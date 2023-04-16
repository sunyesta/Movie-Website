/**
 * General database utility functions
 */

/**
 * Prints a table in the database
 * @param {sqlite3} db a database
 * @param {string} tableName table name
 */
function printTable(db, tableName) {
	sql = `SELECT * FROM ${tableName}`;
	db.all(sql, [], (err, rows) => {
		if (err) return retErr(err);
		console.log("V---data---V  ", tableName);
		console.log(rows);
	});
}

/**
 * appends an identifier to an error statement
 * @param {string} err error
 * @param {string} identifier prints before error
 * @returns
 */
function retErr(err, identifier) {
	identifier = identifier + ": " || "";
	if (err) return console.error(identifier + err.message);
}

/**
 * prints all the table names in a database
 * @param {sqlite3} db database
 */
function printTableNames(db) {
	const sql = `
    SELECT 
        name
    FROM 
        sqlite_schema
    WHERE 
        type ='table' AND 
        name NOT LIKE 'sqlite_%';
    `;
	// get all table names
	db.all(sql, [], (err, rows) => {
		if (err) return retErr(err);

		//get the rows for each table
		rows.forEach((row) => {
			const name = row.name;
			const sql = `PRAGMA table_info(${name});`;

			db.all(sql, [], (err, rows) => {
				console.log(
					"--template-- ",
					name,
					": ",
					rows.map((row) => {
						return row.name;
					})
				);
			});
		});
	});
}

/**
 * drops all the tables in a database
 * @param {sqlite3} db database
 */
function dropTables(db) {
	const sql = `
    SELECT 
        name
    FROM 
        sqlite_schema
    WHERE 
        type ='table' AND 
        name NOT LIKE 'sqlite_%';
    `;
	db.all(sql, [], (err, rows) => {
		if (err) return retErr(err);
		rows.forEach((row) => {
			const sql = `DROP TABLE ${row.name};`;
			db.run(sql);
		});
	});
}

module.exports = {
	printTable,
	retErr,
	printTableNames,
	dropTables,
};
