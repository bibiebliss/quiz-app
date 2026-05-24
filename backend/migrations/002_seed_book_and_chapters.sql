insert into books (title, author, description, published_year)
values (
  'Thinking, Fast and Slow',
  'Daniel Kahneman',
  'Core seed book for v1 quiz and retention flow',
  2011
)
on conflict do nothing;

with selected_book as (
  select id from books where title = 'Thinking, Fast and Slow' limit 1
)
insert into chapters (book_id, chapter_number, title, summary)
select selected_book.id, chapter_number, title, summary
from selected_book,
(
  values
    (1, 'The Characters of the Story', 'Introduces System 1 and System 2 thinking.'),
    (2, 'Attention and Effort', 'Explains limits of attention and mental effort.'),
    (3, 'The Lazy Controller', 'Describes cognitive ease and reduced vigilance.')
) as chapter_data(chapter_number, title, summary)
on conflict (book_id, chapter_number) do update
set title = excluded.title,
    summary = excluded.summary;
