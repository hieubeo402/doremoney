-- 1. Bảng Ngân sách (Budgets)
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bảng Tiết kiệm (Savings)
CREATE TABLE savings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  deadline DATE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng Khoản vay (Loans)
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'lend' (Cho mượn) hoặc 'borrow' (Đi vay)
  person_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  note TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending', -- 'pending' (Chưa trả), 'paid' (Đã trả xong)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
