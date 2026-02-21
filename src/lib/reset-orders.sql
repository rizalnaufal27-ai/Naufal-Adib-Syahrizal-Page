-- WARNING: THIS WILL DELETE ALL ORDERS AND CHAT MESSAGES

-- 1. Delete all chat messages first (due to foreign key constraints)
DELETE FROM public.chat_messages;

-- 2. Delete all orders
DELETE FROM public.orders;

-- 3. Reset the order_number sequence to start from 1
ALTER SEQUENCE public.orders_order_number_seq RESTART WITH 1;

-- 4. Verify everything is empty
SELECT count(*) FROM public.orders;
