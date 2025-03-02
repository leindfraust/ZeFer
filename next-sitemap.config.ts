/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.BASE_URL || "https://www.zefer.blog/",
    generateRobotsTxt: true, // (optional)
    // ...other options
};
