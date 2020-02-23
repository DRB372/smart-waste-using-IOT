SELECT * FROM person;
SELECT * FROM employee;

SELECT * FROM person AS P JOIN employee AS E ON E.person_id = P.person_id;

SELECT E.employee_id, P.full_name, P.gender, P.cnic, P.contact, P.email, E.employee_type, E.shift
FROM person AS P
    JOIN employee AS E
        ON E.person_id = P.person_id;
    
SELECT E.employee_id, P.full_name, P.gender, P.cnic, P.contact, P.email, P.dob, P.home_address,
    E.avatar, E.employee_type, E.shift, E.account_no, E.created_at
FROM person AS P
    JOIN employee AS E
        ON E.person_id = P.person_id
WHERE E.employee_id = 1;

SELECT E.employee_id, P.email, E.passwrd
FROM person AS P
    JOIN employee AS E
        ON E.person_id = P.person_id
WHERE P.email = 'alia@example.com';