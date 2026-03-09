select e.student_id, s.student_name, e.subject_name, 
    count(sj.subject_name) as attended_exams
from Subjects sj
left join Examinations e on e.subject_name = sj.subject_name
left join Students s on s.student_id = e.student_id
group by e.subject_name, e.student_id, s.student_name
order by e.student_id, s.student_name





select s.student_id, s.student_name, sj.subject_name
    --,count(e.subject_name) as attended_exams
from Students s
CROSS join Subjects sj
left join Examinations e on e.student_id = s.student_id 
    and sj.subject_name = e.subject_name
group by e.subject_name, s.student_id, s.student_name
order by s.student_id, s.student_name
