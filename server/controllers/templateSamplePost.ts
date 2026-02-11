import simplifyNumber = require('../utils/simplifyNumber');

interface PostData {
  content: string;
  imageLink?: string;
  fromName: string;
  socialMedia: string;
  timestamp: string | Date;
  postType: string;
  category: string;
  engagement: number;
  hashtag: number;
  link?: string;
  imgBase64?: string;
  views?: number;
}

export const getHtml = function ({
  content,
  imageLink,
  fromName,
  socialMedia,
  timestamp,
  postType,
  category,
  engagement,
  hashtag,
  link,
  imgBase64,
  views,
}: PostData) {
  const defaultImage =
    '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';
  let contentReplace = '';
  if (content == 'text') {
    contentReplace = '';
  } else {
    contentReplace = content;
  }
  const getSocialMediaBorder = (socialMedia: string) => {
    // Ensure case-insensitive matching
    const key = socialMedia ? socialMedia.toLowerCase().trim() : '';
    switch (key) {
      case 'twitter':
      case 'x':
        return 'border-[#1da1f2]'; // Keep class for backup but rely on inline
      case 'instagram':
        return 'border-[#E1306C]';
      case 'youtube':
        return 'border-[#FF0000]';
      case 'facebook':
        return 'border-[#1877F2]';
      case 'tiktok':
        return 'border-black';
      default:
        return '';
    }
  };

  const getSocialMediaBorderStyle = (socialMedia: string) => {
    const key = socialMedia ? socialMedia.toLowerCase().trim() : '';
    switch (key) {
      case 'twitter':
      case 'x':
        return 'border-color: #1da1f2;';
      case 'instagram':
        return 'border-color: #E1306C;';
      case 'youtube':
        return 'border-color: #FF0000;';
      case 'facebook':
        return 'border-color: #1877F2;';
      case 'tiktok':
        return 'border-color: #000000;';
      default:
        return '';
    }
  };
  const getSocialMediaIcon = (socialMedia: string) => {
    // Ensure case-insensitive matching
    const key = socialMedia ? socialMedia.toLowerCase().trim() : '';

    // Base usage: Flex container, rounded circle, colored background, white text/icon
    const iconBase = 'rounded-full flex items-center justify-center text-white';
    // Fixed size 48px (3rem)
    const style = 'width: 3rem; height: 3rem; font-size: 1.5rem;';

    switch (key) {
      case 'twitter':
      case 'x':
        return `<div class="${iconBase}" style="background-color: #000000; color: white; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg></div>`;

      case 'instagram':
        return `<div class="${iconBase}" style="background-color: #E1306C; color: white; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></div>`;

      case 'youtube':
        return `<div class="${iconBase}" style="background-color: #FF0000; color: white; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg></div>`;

      case 'facebook':
        return `<div class="${iconBase}" style="background-color: #1877F2; color: white; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg></div>`;

      case 'tiktok':
        return `<div class="${iconBase}" style="background-color: #000000; color: white; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg></div>`;

      default:
        return `<div class="${iconBase}" style="background-color: #e5e7eb; color: #9ca3af; ${style}"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path></svg></div>`;
    }
  };

  const getPostTypeIcon = (postType: string) => {
    switch (postType) {
      case 'video':
        return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z"></path></svg>`;
      case 'image':
        return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path></svg>`;
      default:
        return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path></svg>`;
    }
  };

  const formatCompactNumber = (number: number) => {
    if (typeof number !== 'number' || isNaN(number)) return '0';
    return normalize(number);
  };

  const normalize = (number: number) => {
    return simplifyNumber(number);
  }

  const renderPostDetail = (postType: string) => {
    // Icons for metrics - Increased to 28px
    const thumbsUpIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="28px" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z"></path></svg>`;
    const commentIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="28px" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>`;
    const peopleIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="28px" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>`;

    const engagStr = formatCompactNumber(engagement);
    const hashStr = formatCompactNumber(hashtag);
    const viewsStr = formatCompactNumber(views || 0);

    // Dynamic font size: text-2xl for short, text-base for long (>4 chars)
    const getFontSize = (str: string) => (str.length > 4 ? 'text-base' : 'text-2xl');

    const engagClass = getFontSize(engagStr);
    const hashClass = getFontSize(hashStr);
    const viewsClass = getFontSize(viewsStr);

    if (postType === 'video')
      return `<div class="mb-4">
          <div class="flex justify-between items-start px-2 mb-3 gap-2">
            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center">Like</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${thumbsUpIcon}
                <span class="${engagClass} font-bold">${engagStr}</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center">Comment</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${commentIcon}
                <span class="${hashClass} font-bold">${hashStr}</span>
              </div>
            </div>

            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center whitespace-nowrap">Total Engagement</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${peopleIcon}
                <span class="${viewsClass} font-bold">${viewsStr}</span>
              </div>
            </div>
          </div>
        </div>`;
    else {
      return `<div class="mb-4">
          <div class="flex justify-between items-start px-2 mb-3 gap-2">
            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center">Like</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${thumbsUpIcon}
                <span class="${engagClass} font-bold">${engagStr}</span>
              </div>
            </div>

            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center">Comment</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${commentIcon}
                <span class="${hashClass} font-bold">${hashStr}</span>
              </div>
            </div>

            <div class="flex flex-col gap-1 items-center flex-1">
              <div class="font-semibold text-xs text-[#666666] text-center whitespace-nowrap">Total Engagement</div>
              <div class="flex items-center gap-2" style="color: #00AED6;">
                ${peopleIcon}
                <span class="${engagClass} font-bold">${engagStr}</span>
              </div>
            </div>
          </div>
        </div>`;
    }
  };

  const renderAccountName = (name: string) => {
    const charLength = name.length;
    if (charLength > 18 && charLength <= 20) {
      return `<h3 class="line-clamp-1 font-extrabold text-lg text-[#1a1a1a]">${name}</h3>`;
    }
    if (charLength > 20) {
      return `<h3 class="line-clamp-2 text-xl font-extrabold text-[#1a1a1a]">${name}</h3>`;
    }
    return `<h3 class="text-2xl line-clamp-2 font-extrabold text-[#1a1a1a]">${name}</h3>`;
  };

  return String.raw`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.11/dayjs.min.js"
      integrity="sha512-FwNWaxyfy2XlEINoSnZh1JQ5TRRtGow0D6XcmAWmYCRgvqOUTnzCxPc9uF35u5ZEpirk1uhlPVA19tflhvnW1g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <title>Document</title>
  </head>
  <body>
  <div
      class="mx-auto my-[4px] p-6 w-[450px] bg-white rounded-3xl border-4 shadow-card"
      style="${getSocialMediaBorderStyle(socialMedia)}"
    >
      <!-- Header with Platform Logo and Name -->
      <div class="mb-4 flex items-start gap-3">
        <div class="flex-shrink-0">${getSocialMediaIcon(socialMedia)}</div>
        <div class="grow min-w-0">
          ${renderAccountName(fromName)}
          <div class="flex justify-between items-center mt-1 gap-2">
            <div id="date" class="text-sm text-[#666666]">
            </div>
            <div class="text-[#4B4B4B] flex items-center gap-2 border-slate-200 border-2 rounded-full px-3 py-1 text-sm font-medium">
              ${getPostTypeIcon(postType)}
              <span>
                ${postType.slice(0, 1).toUpperCase()}${postType.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Category -->
      <div class="flex justify-start items-center gap-2 text-base font-medium mb-3 text-[#666666]">
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            color="#999999"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
            style="color: rgb(153, 153, 153);"
        >
            <path d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"></path>
        </svg>
        <p class="truncate">
          ${category}
        </p>
      </div>

      <hr class="border-slate-200 mb-4" />

      <!-- Post Image -->
      <object
        data="data:image/jpeg;base64,${imgBase64}"
        type="image/jpeg"
        width="100%"
        class="object-cover aspect-square rounded-2xl mb-4"
      >
        <img
          src="data:image/jpeg;base64,${defaultImage}"
          alt=""
          class="object-cover aspect-square rounded-2xl mb-4"
        />
      </object>

      <!-- Metrics Section -->
      ${renderPostDetail(postType)}

      <!-- Content/Caption -->
      <div class="font-semibold text-xs text-[#666666] mb-1">Description</div>
      <div id="content" class="text-left text-base leading-relaxed h-[110px] line-clamp-4 text-[#333333]">
        ${contentReplace}
      </div>
    </div>
    <script>
    document.querySelector("#date").innerHTML = dayjs(
      new Date("${timestamp}")
    ).format("D MMM YYYY, h:mm A");
    </script>
    <style>
    *,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.shadow-card{box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)}.absolute{position:absolute}.relative{position:relative}.-bottom-\[2px\]{bottom:-2px}.-right-\[2px\]{right:-2px}.z-10{z-index:10}.m-5{margin:1.25rem}.mx-4{margin-left:1rem;margin-right:1rem}.mx-auto{margin-left:auto;margin-right:auto}.my-\[4px\]{margin-top:4px;margin-bottom:4px}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-\[-28px\]{margin-bottom:-28px}.ml-\[-275px\]{margin-left:-275px}.mr-\[-22px\]{margin-right:-22px}.mt-1{margin-top:.25rem}.mt-4{margin-top:1rem}.mt-\[-20px\]{margin-top:-20px}.flex{display:flex}.grid{display:grid}.aspect-square{aspect-ratio:1 / 1}.h-20{height:5rem}.h-\[110px\]{height:110px}.h-\[118px\]{height:118px}.h-\[210px\]{height:210px}.h-\[84px\]{height:84px}.min-w-0{min-width:0}.w-12{width:3rem}.w-20{width:5rem}.w-\[1000px\]{width:1000px}.w-\[450px\]{width:450px}.w-\[600px\]{width:600px}.flex-shrink-0{flex-shrink:0}.grow{flex-grow:1}.basis-1\/2{flex-basis:50%}.basis-1\/3{flex-basis:33.333333%}.flex-col{flex-direction:column}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-5{gap:1.25rem}.gap-6{gap:1.5rem}.gap-7{gap:1.75rem}.overflow-hidden{overflow:hidden}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border{border-width:1px}.border-2{border-width:2px}.border-4{border-width:4px}.border-l-2{border-left-width:2px}.border-\[#2098E7\]{--tw-border-opacity: 1;border-color:rgb(32 152 231 / var(--tw-border-opacity))}.border-\[#4267B2\]{--tw-border-opacity: 1;border-color:rgb(66 103 178 / var(--tw-border-opacity))}.border-\[#833AB4\]{--tw-border-opacity: 1;border-color:rgb(131 58 180 / var(--tw-border-opacity))}.border-\[#FF0000\]{--tw-border-opacity: 1;border-color:rgb(255 0 0 / var(--tw-border-opacity))}.border-black{--tw-border-opacity: 1;border-color:rgb(0 0 0 / var(--tw-border-opacity))}.border-slate-200{--tw-border-opacity: 1;border-color:rgb(226 232 240 / var(--tw-border-opacity))}.border-slate-300{--tw-border-opacity: 1;border-color:rgb(203 213 225 / var(--tw-border-opacity))}.bg-\[#2098E7\]{--tw-bg-opacity: 1;background-color:rgb(32 152 231 / var(--tw-bg-opacity))}.bg-\[#4267B2\]{--tw-bg-opacity: 1;background-color:rgb(66 103 178 / var(--tw-bg-opacity))}.bg-\[#833AB4\]{--tw-bg-opacity: 1;background-color:rgb(131 58 180 / var(--tw-bg-opacity))}.bg-\[#E7F3F7\]{--tw-bg-opacity: 1;background-color:rgb(231 243 247 / var(--tw-bg-opacity))}.bg-\[#FF0000\]{--tw-bg-opacity: 1;background-color:rgb(255 0 0 / var(--tw-bg-opacity))}.bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-cover{background-size:cover}.object-cover{-o-object-fit:cover;object-fit:cover}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-\[0\.3em\]{padding:.3em}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.text-left{text-align:left}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-\[12px\]{font-size:12px}.text-\[20px\]{font-size:20px}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-medium{font-weight:500}.font-semibold{font-weight:600}.leading-relaxed{line-height:1.625}.text-\[#333333\]{--tw-text-opacity: 1;color:rgb(51 51 51 / var(--tw-text-opacity))}.text-\[#4B4B4B\]{--tw-text-opacity: 1;color:rgb(75 75 75 / var(--tw-text-opacity))}.text-\[#535353\]{--tw-text-opacity: 1;color:rgb(83 83 83 / var(--tw-text-opacity))}.text-\[#666666\]{--tw-text-opacity: 1;color:rgb(102 102 102 / var(--tw-text-opacity))}.line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.line-clamp-4{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4}
    </style>
  </body>`;
};
