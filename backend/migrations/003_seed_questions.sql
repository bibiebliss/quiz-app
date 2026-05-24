with selected_chapters as (
  select id, chapter_number
  from chapters
  where title in ('The Characters of the Story', 'Attention and Effort', 'The Lazy Controller')
)
insert into questions (
  chapter_id,
  question_text,
  question_type,
  options,
  correct_answer,
  explanation,
  difficulty,
  source
)
select
  sc.id,
  q.question_text,
  'mcq',
  q.options::jsonb,
  q.correct_answer,
  q.explanation,
  q.difficulty,
  'manual'
from selected_chapters sc
join (
  values
    (1, 'Which system is fast, automatic, and emotional?', '["System 1","System 2","Working memory","Executive control"]', 'System 1', 'System 1 operates quickly and automatically.', 1),
    (2, 'What does the chapter "Attention and Effort" emphasize?', '["Unlimited focus","Costless cognition","Finite mental resources","No relation to effort"]', 'Finite mental resources', 'Attention is a limited resource tied to effort.', 2),
    (3, 'In "The Lazy Controller", what happens when System 2 is not engaged?', '["More deliberate reasoning","Reduced reliance on heuristics","Greater cognitive vigilance","Default acceptance of intuitive responses"]', 'Default acceptance of intuitive responses', 'When System 2 is idle, System 1 responses dominate.', 2)
) as q(chapter_number, question_text, options, correct_answer, explanation, difficulty)
  on q.chapter_number = sc.chapter_number
on conflict do nothing;
