function printTable(db, tableName) {
	sql = `SELECT * FROM ${tableName}`;
	db.all(sql, [], (err, rows) => {
		if (err) return retErr(err);
		console.log("V---data---V  ", tableName);
		console.log(rows);
	});
}

function retErr(err, key) {
	key = key + ": " || "";
	if (err) return console.error(key + err.message);
}

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
