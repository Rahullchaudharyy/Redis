export function formatTimestampCustom(timestamp: string): string {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-6); // Adjust this for 6 digits

    return `${day} ${month} ${year}`;
}

export function getTodayDate(): string {
    const today = new Date();
    return today.toISOString();
}

export function ageOfDays(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    // Calculate the difference in milliseconds
    const diff = now.getTime() - date.getTime();

    // Convert differences to relative time components
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
}

export function monthsAgo(isoDate: string): number {
    const date = new Date(isoDate);
    const now = new Date();

    // Calculate the difference in years and months
    const yearsDiff = now.getFullYear() - date.getFullYear();
    const monthsDiff = now.getMonth() - date.getMonth();

    // Total months difference
    return yearsDiff * 12 + monthsDiff;
}
