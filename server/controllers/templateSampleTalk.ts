
import * as media from './media';

interface TalkData {
  imageLink: string;
  fromName: string;
  content: string;
  timestamp: Date | string;
  socialMedia: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  username?: string;
}

export const getHtml = function (data: TalkData) {
  switch (data.socialMedia) {
    case 'instagram':
      return getInstagramHtml(data);
    case 'twitter':
      return getTwitterHtml(data);
    case 'facebook':
      return getFacebookHtml(data);
    case 'youtube':
      return getYoutubeHtml(data);
    case 'tiktok':
      return getTiktokHtml(data);
    default:
      return getDefaultHtml(data);
  }
};

const truncateText = (text: string, maxLength = 80) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const getSocialMediaIcon = (socialMedia: string) => {
  switch (socialMedia) {
    case 'twitter':
      return `<div class="social-icon twitter-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="#ffffff" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255);"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg></div>`;
    case 'instagram':
      return `<div class="social-icon instagram-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" color="#ffffff" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255)"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></div>`;
    case 'youtube':
      return `<div class="social-icon youtube-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" color="#ffffff" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255)"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg></div>`;
    case 'facebook':
      return `<div class="social-icon facebook-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" color="#ffffff" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255);"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg></div>`;
    case 'tiktok':
      return `<div class="social-icon tiktok-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" color="#ffffff" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255);"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg></div>`;
    default:
      return `<div class="social-icon default-bg"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path></svg></div>`;
  }
};

function formatTime(timestamp: string | Date | number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getInstagramHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card instagram">
      <div class="profile-section">
        <div class="avatar-wrapper">
          <img src="${data.imageLink}" class="avatar" />
          <div class="logo-icon">${getSocialMediaIcon(data.socialMedia)}</div>
        </div>
        <div class="text">
          <p><strong>${data.fromName}</strong> <span class="font-normal">${truncateText(data.content, 268)}</span></p>
          <p class="timestamp">${formatTime(data.timestamp)}</p>
        </div>
        <img src="${media.loveButton}" class="action-icon" />
      </div>
    </div>
  `);
}

function getTwitterHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card twitter">
      <div class="profile-section">
        <div class="avatar-wrapper">
          <img src="${data.imageLink}" class="avatar" />
          <div class="logo-icon">${getSocialMediaIcon(data.socialMedia)}</div>
        </div>
        <div class="text">
          <p><strong>${data.fromName}</strong> <strong>@${data.username}</strong> · <span class="timestamp">${formatTime(data.timestamp)}</span></p>
          <p><span class="font-normal">${truncateText(data.content, 280)}</span></p>
        </div>
        <img src="${media.meatballButton}" class="action-icon" />
      </div>
    </div>
  `);
}

function getFacebookHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card facebook">
      <div class="profile-section">
        <div class="avatar-wrapper">
          <img src="${data.imageLink}" class="avatar" />
          <div class="logo-icon">${getSocialMediaIcon(data.socialMedia)}</div>
        </div>
        <div class="bubble">
          <p><strong>@${data.fromName}</strong></p>
          <p><span class="font-normal">${truncateText(data.content, 80)}</span></p>
        </div>
        <img src="${media.facebookLikeButton}" class="action-icon" />
      </div>
      <p class="timestamp">${formatTime(data.timestamp)}</p>
    </div>
  `);
}

function getYoutubeHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card youtube">
      <div class="profile-section">
        <div class="avatar-wrapper">
          <img src="${data.imageLink}" class="avatar" />
          <div class="logo-icon">${getSocialMediaIcon(data.socialMedia)}</div>
        </div>
        <div class="text">
          <p><strong>@${data.fromName}</strong> • <span class="timestamp">${formatTime(data.timestamp)}</span></p>
          <p><span class="font-normal">${truncateText(data.content, 80)}</span></p>
        </div>
        <img src="${media.kebabButton}" class="action-icon" />
      </div>
    </div>
  `);
}

function getTiktokHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card tiktok">
      <div class="profile-section">
        <div class="avatar-wrapper">
          <img src="${data.imageLink}" class="avatar" />
          <div class="logo-icon">${getSocialMediaIcon(data.socialMedia)}</div>
        </div>
        <div class="text">
          <p><strong>${data.fromName}</strong></p>
          <p><span class="font-normal">${truncateText(data.content, 150)}</span></p>
        </div>
        <img src="${media.loveButton}" class="action-icon" />
      </div>
      <p class="timestamp">${formatTime(data.timestamp)}</p>
    </div>
  `);
}

function getDefaultHtml(data: TalkData) {
  return baseHtmlWrapper(`
    <div class="card default">
      <p><strong>${data.fromName}</strong></p>
      <p><span class="font-normal">${data.content}</span></p>
      <p class="timestamp">${formatTime(data.timestamp)}</p>
    </div>
  `);
}

function baseHtmlWrapper(inner: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Social Comment</title>
    <style>
      body {
        font-family: sans-serif;
      }
      .card {
        width: 100%;
        max-width: 700px;
        border-radius: 12px;
        margin-bottom: 20px;
        background-color: #FFFFFF; 
        color: #333333; 
        margin-left: auto;
        margin-right: auto;
        padding: 16px;
        box-sizing: border-box;
        overflow: hidden;
        border: 1px solid #E0E0E0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .profile-section {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        position: relative;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #E0E0E0;
      }
      .avatar-wrapper {
        position: relative;
      }

      .logo-icon {
        position: absolute;
        bottom: -4px;
        right: -4px;
      }
      .social-icon {
        position: absolute;
        bottom: -2px;
        right: -2px;
        z-index: 10;
        border-radius: 50%;
        padding: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
      }
      .twitter-bg {
        background-color: #1DA1F2;
      }
      .instagram-bg {
        background: linear-gradient(45deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%);
      }
      .youtube-bg {
        background-color: #FF0000;
      }
      .facebook-bg {
        background-color: #4267B2;
      }
      .tiktok-bg {
        background-color: #000000;
      }
      .default-bg {
        background-color: #6B7280;
      }
      .platform-icon {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background-color: white;
        border-radius: 50%;
        padding: 2px;
      }
      .text {
        flex: 1;
      }
      .bubble {
        background-color: #F0F2F5; /* Light gray bubble for Facebook */
        border-radius: 18px;
        padding: 10px 14px;
        color: #050505;
      }
      .timestamp {
        font-size: 12px;
        color: #65676B;
        margin-top: 4px;
      }
      .action-icon {
        width: 20px;
        height: 20px;
        margin-left: auto;
      }
      .font-normal {
        font-weight: normal;
      }
      @media (max-width: 480px) {
        .card {
          border-radius: 8px;
          padding: 12px;
        }
        .avatar {
          width: 40px;
          height: 40px;
        }
      }
    </style>
  </head>
  <body>
    ${inner}
  </body>
  </html>
  `;
}