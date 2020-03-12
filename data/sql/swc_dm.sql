DELETE FROM employee WHERE employee_id = 5;

INSERT INTO person(full_name, cnic, gender, email)
    VALUES ('superuser', '12345-1234567-5', 'male', 'superuser2@example.com');

INSERT INTO employee(person_id, passwrd, created_at)
VALUES (3, '12345678', NOW());

SELECT * FROM person;
SELECT * FROM employee;
SELECT * FROM bins;

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

UPDATE employee AS E JOIN person AS P ON E.person_id = P.person_id
SET full_name='atif'
WHERE employee_id=2