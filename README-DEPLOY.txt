SMART FITNESS JOURNAL — DEPLOYMENT

Назначение: заменить текущий статический блог на Sport Shop Fitness.

Целевой каталог Beget:
public_html/blog/

ВАЖНО:
1. Старую папку public_html/blog можно удалить полностью.
2. Создать чистую public_html/blog/.
3. Распаковать СОДЕРЖИМОЕ ЭТОГО АРХИВА прямо в public_html/blog/.
4. В результате public_html/blog/index.html должен лежать непосредственно в корне blog/.
5. Не должно получиться public_html/blog/v21/... или public_html/blog/smart-fitness-journal-.../...

Структура:
blog/
  index.html
  assets/
  articles/
  directions/
  topics/
  sitemap.xml
  robots.txt
  privacy.html

Добавлен локальный .htaccess:
- DirectoryIndex index.html
- отключает MultiViews
- задаёт UTF-8
- не содержит WordPress rewrite

После загрузки проверь:
https://sportshopfitness.ru/blog/index.html
https://sportshopfitness.ru/blog/
https://sportshopfitness.ru/blog/topics/
https://sportshopfitness.ru/blog/directions/

После подтверждения работы /blog/index.html можно использовать /blog/ как основной URL.
