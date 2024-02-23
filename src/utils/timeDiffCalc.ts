const timeDiff = (createdAt: Date) => {
    const timeDiff = new Date().getTime() - new Date(createdAt).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

    if (months) return `${months} ${months > 1 ? "months" : "month"} ago`;
    if (days) return `${days} ${days > 1 ? "days" : "day"} ago`;
    if (hours) return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    if (minutes) return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    if (seconds) return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
};

export default timeDiff;
