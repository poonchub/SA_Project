import { Notification } from '../../Interfaces/INotification';

const notificationKey = 'notifications';

// ฟังก์ชันสำหรับดึงการแจ้งเตือนจาก localStorage
export const getNotifications = (): Notification[] => {
    const storedNotifications = localStorage.getItem(notificationKey);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
};

// ฟังก์ชันสำหรับเพิ่มการแจ้งเตือน
export const addNotification = (message: string) => {
    const notifications = getNotifications();
    const newNotification = { id: notifications.length + 1, message };
    const updatedNotifications = [...notifications, newNotification];

    // อัปเดตการแจ้งเตือนใน localStorage
    localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
};
