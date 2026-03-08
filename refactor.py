import re

with open('c:/Projects/rent-a-cear/frontend/src/pages/admin/Bookings.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make a backup
with open('c:/Projects/rent-a-cear/frontend/src/pages/admin/Bookings.tsx.bak', 'w', encoding='utf-8') as f:
    f.write(text)

# Regex replacements for dual themes
replacements = [
    (r'class(Name)?=\"([^\"]*?)bg-slate-900/40([^\"]*?)\"', r'className="\2bg-white/90 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none\3"'),
    (r'class(Name)?=\"([^\"]*?)bg-black/20([^\"]*?)\"', r'className="\2bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10\3"'),
    (r'class(Name)?=\"([^\"]*?)bg-white/5([^\"]*?)\"', r'className="\2bg-slate-100 dark:bg-white/5\3"'),
    (r'class(Name)?=\"([^\"]*?)text-white([^\"]*?)\"', r'className="\2text-slate-900 dark:text-white\3"'),
    (r'class(Name)?=\"([^\"]*?)text-slate-300([^\"]*?)\"', r'className="\2text-slate-600 dark:text-slate-300\3"'),
    (r'class(Name)?=\"([^\"]*?)text-slate-400([^\"]*?)\"', r'className="\2text-slate-500 dark:text-slate-400\3"'),
    (r'class(Name)?=\"([^\"]*?)border-white/5([^\"]*?)\"', r'className="\2border-slate-200 dark:border-white/5\3"'),
    (r'glass', r'bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300'),
    (r'bg-slate-800/50', r'bg-slate-100 dark:bg-slate-800/50'),
    (r'bg-slate-900/50', r'bg-slate-50 dark:bg-slate-900/50'),
    (r'text-slate-500([^\"]*?)(?!dark:text)', r'text-slate-500 dark:text-slate-400\1'),
    (r'bg-slate-900/80', r'bg-white/90 dark:bg-slate-900/80'),
]

for src, dst in replacements:
    text = re.sub(src, dst, text)

with open('c:/Projects/rent-a-cear/frontend/src/pages/admin/Bookings.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Replaced')
