import axios from 'axios';
import * as pathExpress from 'path';
const { generateTitleContent } = require('../utils/content');
const { addNoDataMessage, isDataEmpty } = require('../utils/noDataMessage');
const { generateSamplePostImage, generateSampleArticleImage, generateSampleTalkImage } = require('../controllers/puppeteerGenerateImage');
const {
    generateSamplePostPpt,
    generateSamplePostLink,
    generateSampleArticleLink,
    generateSampleTalkPpt,
    generateSampleTalkLink
} = require('../utils/sample');

const {
    transformPosition,
    generateCustomPosition,
    getSamplePostPositions,
    getSamplePostLinkPosition,
    adjustPositionForSummary,
    generatePositionWithSummary,
} = require('../utils/position');
const { getHashTags } = require('../utils/text');

const env = process.env.NODE_ENV || 'development';
const config = require('../../server/config/config.json')[env];
// Override path for local development to avoid ENOENT
let exportPath = pathExpress.join(__dirname, '../../exports/');
// let exportPath = config.EXPORT_PATH;

// Interfaces
interface SampleDataCommon {
    titleContent: string;
    visualization: string;
}

interface SamplePostData extends SampleDataCommon {
    streamOutput?: any[];
    details?: any;
}

interface SampleArticleData extends SampleDataCommon {
    onlineMediaStream?: any[];
}

interface SampleTalkData extends SampleDataCommon {
    streamOutput?: any[];
}

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
    wTitle?: number;
    xTitle?: number;
}

interface SummaryConfig {
    enabled: boolean;
    position: 'left' | 'top' | 'right' | 'bottom';
}

interface HandlerOptions {
    browser: any;
    counter: number;
    slideType?: string;
    summaryConfig?: SummaryConfig;
}

async function fetchImageBase64(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary').toString('base64');
    } catch (error: any) {
        console.error('Error fetching image base64:', error.message);
        return null;
    }
}

function buildSampleArticleData(item: any, indexOrCounter: number, imgBase64: string | null) {
    return {
        id: `sample-article-${indexOrCounter}-${item?.originalId}`,
        title: item?.title,
        datePublished: item?.datePublished,
        sourceName: item?.sourceName,
        imageSrc: item?.imageSrc,
        imgBase64,
        link: item?.link,
    };
}

async function buildSampleTalkImage({ browser, path, item, index }: { browser: any, path: string, item: any, index: number }) {
    return await generateSampleTalkImage({
        browser,
        pathDir: path,
        data: {
            id: `sample-talk-${index}-${item?.originalId}`,
            imageLink: item?.mediaLink,
            fromName: item?.fromName,
            content: item?.content,
            timestamp: item?.timestamp,
            socialMedia: item?.socialMedia,
        },
    });
}

function renderSampleTalkSlide(slide: any, item: any, sampleTalkImage: string, path: string, posTalk: Position, posLink: Position) {
    slide.addText(
        item?.link?.substring(0, 30) || '',
        generateSampleTalkLink(posLink, item?.link)
    );
    slide.addImage(generateSampleTalkPpt(posTalk, `${path}${sampleTalkImage}`));
}

async function handleSamplePost(data: SamplePostData, slide: any, position: Position, { browser, counter, slideType, summaryConfig }: HandlerOptions) {
    const { titleContent, visualization, streamOutput } = data;

    // Check for empty data first
    if (!streamOutput || isDataEmpty(streamOutput)) {
        addNoDataMessage(slide, position, titleContent);
        return;
    }

    // Auto-limit data when summary is enabled
    let effectiveStreamOutput = streamOutput;
    if (summaryConfig && summaryConfig.enabled && slideType === 'verticalFourContents') {
        // Only reduce to 3 items if summary is on the LEFT.
        // If summary is on TOP, we can fit all 4 items.
        if (summaryConfig.position === 'left') {
            effectiveStreamOutput = streamOutput.slice(0, 3);
        }
    }

    // helper untuk bikin data image
    const buildSamplePostData = (item: any, index: number) => ({
        id: `sample-post-${index}-${item?.originalId}`,
        content: item?.content,
        imageLink: item?.mediaLink,
        link: item?.link,
        fromName: item?.fromName,
        socialMedia: item?.socialMedia,
        timestamp: item?.timestamp,
        postType: item?.contentType,
        category: item?.label?.[0]?.displayName ?? '-',
        engagement: item?.engagement,
        hashtag: getHashTags(item?.content),
        imgBase64: item?.imgBase64,
        views: item?.viewCount,
    });

    const handlers: { [key: string]: () => Promise<void> } = {
        sample_post: async () => {
            slide.addText(titleContent, generateTitleContent(position));

            for (let a = 0; a < effectiveStreamOutput.length; a++) {
                try {
                    // Fetch image base64 if not present (crucial for Instagram etc.)
                    let imgBase64 = effectiveStreamOutput[a]?.imgBase64;

                    // Improved fallback logic for image sources
                    const possibleImageSources = [
                        effectiveStreamOutput[a]?.mediaLink,
                        effectiveStreamOutput[a]?.picture,
                        effectiveStreamOutput[a]?.thumbnail,
                        effectiveStreamOutput[a]?.url // Last resort
                    ];

                    if (!imgBase64) {
                        for (const src of possibleImageSources) {
                            if (src && (src.match(/\.(jpeg|jpg|gif|png|webp)/i) || src.includes('cdn') || src.includes('fbcdn') || src.includes('instagram'))) {
                                try {
                                    imgBase64 = await fetchImageBase64(src);
                                    if (imgBase64) break; // Found a valid image
                                } catch (err: any) {
                                    console.error(`Failed to fetch image from ${src}:`, err.message);
                                }
                            }
                        }
                    }

                    const samplePostImage = await generateSamplePostImage({
                        browser,
                        pathDir: exportPath,
                        data: {
                            ...buildSamplePostData(effectiveStreamOutput[a], a),
                            imgBase64: imgBase64 || effectiveStreamOutput[a]?.imgBase64 // Use fetched or original
                        }
                    });

                    let positionCount = effectiveStreamOutput.length;
                    let positionIndex = a;

                    if (slideType === 'verticalFourContents') {
                        const hasSummary = summaryConfig && summaryConfig.enabled;

                        if (hasSummary && summaryConfig.position === 'left') {
                            // Case 1: Summary on Left -> Force 4 slots space, shift content to right (indices 1,2,3)
                            positionCount = 4;
                            positionIndex = a + 1;
                        } else if (!hasSummary && effectiveStreamOutput.length === 3) {
                            // Case 2: No Summary, exactly 3 posts -> Use 3 slots logic for centering
                            positionCount = 3;
                            // positionIndex stays as 'a' (0,1,2)
                        } else {
                            // Case 3: Default behavior (4 slots) or Top Summary
                            positionCount = 4;
                        }
                    }

                    let pos: Position, posLink: Position;

                    // Use generatePositionWithSummary for TOP summary to get the correct constants from size_position.js
                    if (slideType === 'verticalFourContents' && summaryConfig && summaryConfig.enabled && summaryConfig.position === 'top') {
                        const rawPos = generatePositionWithSummary(slideType, a, summaryConfig);
                        pos = transformPosition(rawPos, 0, 0.48);

                        // Calculate link position relative to the card
                        // New card height is 4.8. Link should be just below it.
                        posLink = {
                            x: pos.x + (pos.w / 2) - 0.5, // Center the 1.0 width link text
                            y: pos.y + 4.8 + 0.1, // pos.y + height + gap
                            w: 1.0,
                            h: 0
                        };
                        // Adjust X for link to match standard centers if needed, or just use card X + offset
                        posLink.x = pos.x + (pos.w / 2) - 0.5; // Center the 1.0 width link text
                    } else {
                        pos = transformPosition(getSamplePostPositions(positionCount)[positionIndex], 0, 0.48);
                        posLink = transformPosition(getSamplePostLinkPosition(positionCount)[positionIndex], 0, 0.48);
                    }

                    // For verticalFourContents, shift cards down when they have titleContent
                    if (slideType === 'verticalFourContents' && titleContent && titleContent.trim().length > 0) {
                        const yShift = 1.0; // Increased shift for more visible spacing
                        pos.y += yShift;
                        posLink.y += yShift;
                    }

                    slide.addImage(generateSamplePostPpt(pos, `${exportPath}${samplePostImage}`));
                    slide.addText('Link', generateSamplePostLink(posLink, effectiveStreamOutput[a].link));
                } catch (err) {
                    console.error(
                        `error: failed to generate sample post image for ${effectiveStreamOutput[a]?.socialMedia} ${effectiveStreamOutput[a]?.fromName}`,
                        err
                    );

                    // Generate placeholder card to maintain layout consistency
                    // Placeholder logic... tricky without pos defined if error happens early.
                    // Assuming similar position logic needs to be repeated or extracted.
                    // For now, skipping strict placeholder recreation in this scope to save complexity,
                    // or we could refactor.
                    // Re-implementing simplified placeholder logic:

                    let positionCount = effectiveStreamOutput.length;
                    let positionIndex = a;

                    if (slideType === 'verticalFourContents') {
                        const hasSummary = summaryConfig && summaryConfig.enabled;
                        if (hasSummary && summaryConfig.position === 'left') {
                            positionCount = 4;
                            positionIndex = a + 1;
                        } else if (!hasSummary && effectiveStreamOutput.length === 3) {
                            positionCount = 3;
                        } else {
                            positionCount = 4;
                        }
                    }

                    let pos: Position, posLink: Position;
                    if (slideType === 'verticalFourContents' && summaryConfig && summaryConfig.enabled && summaryConfig.position === 'top') {
                        const rawPos = generatePositionWithSummary(slideType, a, summaryConfig);
                        pos = transformPosition(rawPos, 0, 0.48);
                        posLink = { x: pos.x + (pos.w / 2) - 0.5, y: pos.y + 4.8 + 0.1, w: 1.0, h: 0 };
                    } else {
                        pos = transformPosition(getSamplePostPositions(positionCount)[positionIndex], 0, 0.48);
                        posLink = transformPosition(getSamplePostLinkPosition(positionCount)[positionIndex], 0, 0.48);
                    }

                    if (slideType === 'verticalFourContents' && titleContent && titleContent.trim().length > 0) {
                        const yShift = 1.0;
                        pos.y += yShift;
                        posLink.y += yShift;
                    }

                    // Add placeholder text box
                    slide.addText('⚠️\n\nData Not Available', {
                        x: pos.x,
                        y: pos.y,
                        w: pos.w || 2.84,
                        h: pos.h || 5.12,
                        align: 'center',
                        valign: 'middle',
                        fontSize: 14,
                        bold: true,
                        color: '666666',
                        fill: { color: 'F5F5F5' },
                        line: { color: 'CCCCCC', width: 1 }
                    });

                    // Add disabled link placeholder
                    slide.addText('Link', generateSamplePostLink(posLink, '#'));
                }
            }
        },

        sample_post_single: async () => {
            try {
                const firstPost = streamOutput[0];
                const samplePostImage = await generateSamplePostImage({
                    browser,
                    pathDir: exportPath,
                    data: buildSamplePostData(firstPost, 0),
                });

                const isLayoutSingleContent = slideType === 'singleContents';
                let pos: any = generateCustomPosition('samplePost', counter);

                if (isLayoutSingleContent) pos.x = 5.25;

                // For verticalFourContents with summary, adjust positioning to shift cards right
                if (slideType === 'verticalFourContents' && summaryConfig && summaryConfig.enabled && summaryConfig.position === 'left') {
                    // Recalculate position using 4-slot grid but shifted right (position index counter+1)
                    const positions = getSamplePostPositions(4);
                    const adjustedPos = transformPosition(positions[counter + 1], 0, 0.48);
                    pos = { ...pos, ...adjustedPos };
                }

                // Render title aligned with card position
                if (titleContent) {
                    const titlePos = {
                        ...position,
                        x: pos.x, // Use card's X position for alignment
                        xTitle: pos.x,
                        wTitle: pos.w || position.wTitle
                    };
                    slide.addText(titleContent, generateTitleContent(titlePos));
                }

                // For verticalFourContents, scale card and shift down when titleContent exists
                if (slideType === 'verticalFourContents' && titleContent && titleContent.trim().length > 0) {
                    const scale = 0.85; // Scale to 85%
                    const yShift = 0.6; // Shift down to avoid title overlap

                    // Scale dimensions
                    pos.w = (pos.w || 2.84) * scale;
                    pos.h = (pos.h || 5.12) * scale;

                    // Shift down
                    pos.y += yShift;
                }

                // Position link below the card with small gap (adjusted for scaled height)
                const linkGap = 0.15; // Moderate gap between card and link
                const posLink = { ...pos, y: pos.y + (pos.h || 5.12) + linkGap, w: pos.w || 2.84, h: 0 };

                slide.addImage(generateSamplePostPpt(pos, `${exportPath}${samplePostImage}`));
                slide.addText('Link', generateSamplePostLink(posLink, firstPost?.link));
            } catch (err: any) {
                console.error(
                    `error: failed to generate sample post image for ${streamOutput[0]?.socialMedia} ${streamOutput[0]?.fromName}`,
                    err
                );

                // Generate placeholder card to maintain layout consistency
                const isLayoutSingleContent = slideType === 'singleContents';
                let pos: any = generateCustomPosition('samplePost', counter);

                if (isLayoutSingleContent) pos.x = 5.25;

                // Apply same scaling/shift logic as successful cards
                if (slideType === 'verticalFourContents' && titleContent && titleContent.trim().length > 0) {
                    const scale = 0.85;
                    const yShift = 0.6;
                    pos.w = (pos.w || 2.84) * scale;
                    pos.h = (pos.h || 5.12) * scale;
                    pos.y += yShift;
                }

                const linkGap = 0.15;
                const posLink = { ...pos, y: pos.y + (pos.h || 5.12) + linkGap, w: pos.w || 2.84, h: 0 };

                // Add placeholder text box
                slide.addText('⚠️\n\nData Not Available', {
                    x: pos.x,
                    y: pos.y,
                    w: pos.w || 2.84,
                    h: pos.h || 5.12,
                    align: 'center',
                    valign: 'middle',
                    fontSize: 14,
                    bold: true,
                    color: '666666',
                    fill: { color: 'F5F5F5' },
                    line: { color: 'CCCCCC', width: 1 }
                });

                // Add disabled link placeholder
                slide.addText('Link', generateSamplePostLink(posLink, '#'));
            }
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    } else {
        console.warn(`No handler for sample_post visualization: ${visualization}`);
    }
}

async function handleSampleArticle(data: SampleArticleData, slide: any, position: Position, { browser, counter, summaryConfig }: HandlerOptions) {
    const { titleContent, visualization, onlineMediaStream } = data;

    // Check for empty data
    if (!onlineMediaStream || isDataEmpty(onlineMediaStream)) {
        addNoDataMessage(slide, position, titleContent);
        return;
    }

    const handlers: { [key: string]: () => Promise<void> } = {
        sample_article_multiple: async () => {
            slide.addText(titleContent, generateTitleContent(position));

            // Limit articles when summary is enabled
            let effectiveArticles = onlineMediaStream;
            let useAlternateGrid = false;

            if (summaryConfig && summaryConfig.enabled) {
                // Reduce from 6 to 3 articles to fit with summary
                effectiveArticles = onlineMediaStream.slice(0, 3);
                useAlternateGrid = true; // Use THREE_CONTENT layout for better centering
            }

            for (let a = 0; a < effectiveArticles.length; a++) {
                try {
                    const imgBase64 = await fetchImageBase64(effectiveArticles[a].imageSrc);
                    const sampleArticle = await generateSampleArticleImage({
                        browser,
                        pathDir: exportPath,
                        data: buildSampleArticleData(effectiveArticles[a], a, imgBase64),
                    });

                    // Use THREE_CONTENT for better layout when limited to 3 articles
                    let posArticle, posLink;
                    if (useAlternateGrid) {
                        // Use THREE_CONTENT positions (fuller width, better spacing)
                        posArticle = adjustPositionForSummary(generateCustomPosition('sampleArticleThreeGrid', a), summaryConfig);
                        posLink = adjustPositionForSummary(generateCustomPosition('sampleArticleThreeGridLink', a), summaryConfig);
                    } else {
                        // Use default SIX_CONTENT positions
                        posArticle = adjustPositionForSummary(generateCustomPosition('sampleArticle', a), summaryConfig);
                        posLink = adjustPositionForSummary(generateCustomPosition('sampleArticleLink', a), summaryConfig);
                    }

                    slide.addText('Link', generateSampleArticleLink({ ...posLink, y: posLink.y - 0.2 }, effectiveArticles[a].link));
                    slide.addImage(generateSamplePostPpt({ ...posArticle, y: posArticle.y - 0.2 }, `${exportPath}${sampleArticle}`));
                } catch (err) {
                    console.error(`error: failed to generate sample article image for ${effectiveArticles[a]?.title}`);
                }
            }
        },

        sample_article_single: async () => {
            try {
                const first = onlineMediaStream[0];
                const imgBase64 = await fetchImageBase64(first?.imageSrc);

                const sampleArticle = await generateSampleArticleImage({
                    browser,
                    pathDir: exportPath,
                    data: buildSampleArticleData(first, counter, imgBase64),
                });

                const posArticle = generateCustomPosition('sampleArticle', counter);
                const posLink = generateCustomPosition('sampleArticleLink', counter);

                slide.addText('Link', generateSampleArticleLink(posLink, first?.link));
                slide.addImage(generateSamplePostPpt(posArticle, `${exportPath}${sampleArticle}`));
            } catch (err) {
                console.error(`error: failed to generate sample article image for ${onlineMediaStream[0]?.title}`);
            }
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    } else {
        console.warn(`No handler for sample_article visualization: ${visualization}`);
    }
}

async function handleSampleTalk(data: SampleTalkData, slide: any, position: Position, { browser, counter, summaryConfig }: HandlerOptions) {
    const { titleContent, visualization, streamOutput } = data;

    // Check for empty data
    if (!streamOutput || isDataEmpty(streamOutput)) {
        addNoDataMessage(slide, position, titleContent);
        return;
    }

    const handlers: { [key: string]: () => Promise<void> } = {
        sample_talk: async () => {
            slide.addText(titleContent, generateTitleContent(position));

            // Limit conversations when summary is enabled
            let effectiveTalks = streamOutput;
            let useAlternateGrid = false;

            if (summaryConfig && summaryConfig.enabled) {
                // Reduce from 9 to 6 talks to fit with summary
                effectiveTalks = streamOutput.slice(0, 6);
                useAlternateGrid = true; // Use TWO_ROW_THREE_COL layout for better arrangement
            }

            for (let i = 0; i < effectiveTalks.length; i++) {
                try {
                    const item = effectiveTalks[i];
                    const sampleTalkImage = await buildSampleTalkImage({ browser, path: exportPath, item, index: i });

                    // Use better 2x3 layout when limited to 6 conversations
                    let posTalk, posLink;
                    if (useAlternateGrid) {
                        // Use SIX_CONTENT positions (2 rows x 3 columns - cleaner layout)
                        posTalk = adjustPositionForSummary(generateCustomPosition('sampleTalkSixGrid', i), summaryConfig);
                        posLink = adjustPositionForSummary(generateCustomPosition('sampleTalkSixGridLink', i), summaryConfig);
                    } else {
                        // Use default NINE_CONTENT positions (3x3 grid)
                        posTalk = adjustPositionForSummary(generateCustomPosition('sampleTalk', i), summaryConfig);
                        posLink = adjustPositionForSummary(generateCustomPosition('sampleTalkLink', i), summaryConfig);
                    }

                    renderSampleTalkSlide(slide, item, sampleTalkImage, exportPath, posTalk, posLink);
                } catch (err) {
                    console.error(`error: failed to generate sample talk image for ${effectiveTalks[i]?.socialMedia} ${effectiveTalks[i]?.fromName}`);
                }
            }
        },

        sample_talk_single: async () => {
            try {
                const first = streamOutput[0];
                const sampleTalkImage = await buildSampleTalkImage({ browser, path: exportPath, item: first, index: 0 });
                const posTalk = generateCustomPosition('sampleTalkSingle', counter);
                const posLink = generateCustomPosition('sampleTalkSingleLink', counter);

                renderSampleTalkSlide(slide, first, sampleTalkImage, exportPath, posTalk, posLink);
            } catch (err) {
                console.error(`error: failed to generate sample talk image for ${streamOutput[0]?.socialMedia} ${streamOutput[0]?.fromName}`);
            }
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    } else {
        console.warn(`No handler for sample_talk visualization: ${visualization}`);
    }
}

export {
    handleSamplePost,
    handleSampleArticle,
    handleSampleTalk
};
