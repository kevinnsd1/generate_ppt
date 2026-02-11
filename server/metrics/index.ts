import { handleTalk, handleTalker, handleTalkTalker, handleTalkBySentiment } from './talk_talker';
import { handleSamplePost, handleSampleArticle, handleSampleTalk } from './sample';
import { handleTops, handleTopIssues } from './tops';
import { handleShareOfVoices } from './shareOfVoice';
import { handleSentiment, handleSentimentAnalyst } from './sentiment';
import { handleDayToDays, handleDayToDaySentiment } from './dayToDay';
import { handleBreakdown } from './breakdown';
import { handlePostType, handlePostMade, handleEngagements, handleInterest, handleConversation } from './posts';
import { handleFollowers, handleFollowersGrowth } from './followers';
import { handlePotentials } from './potentials';
import { handlePeakMetrics } from './peaks';
import { handleArticlePortal, handleArticleByMedia } from './articles';
import { handleAdvanceMetric, handleAdvanceMetricOnm } from './advance';
import { handleBrandPosition } from './brandPosition';
import { handleWordCloud } from './wordCloud';
import { handleNewsTotalArticle, handleTotals } from './totals';

/**
 * @file metrics/index.ts
 * @description
 * Berisi daftar *metric handler* yang dipetakan berdasarkan nama metric.
 * Tiap metric merepresentasikan tipe data atau visualisasi yang berbeda
 * (misal: talk, sentiment, sample_post, engagement, dsb).
 *
 * Struktur ini memungkinkan sistem untuk memanggil handler yang sesuai
 * tanpa perlu menggunakan banyak if/else di controller.
 *
 * Contoh:
 *  - Metric "talk" akan menggunakan `handleTalk`
 *  - Metric "top_influencer" akan menggunakan `handleTops`
 *  - Metric "wordcloud" akan menggunakan `handleWordCloud`
 *
 * Handler bertanggung jawab untuk menggambar elemen spesifik pada slide PPTX.
 */

const metricHandlers: { [key: string]: Function } = {
    // Talk & Talker metrics
    talk: handleTalk,
    talker: handleTalker,
    talk_talker: handleTalkTalker,
    talk_by_sentiment: handleTalkBySentiment,
    sample_post: handleSamplePost,
    sample_article: handleSampleArticle,
    sample_talk: handleSampleTalk,

    // grup TOP metric — menggunakan handler yang sama
    top_talker: handleTops,
    top_influencer: handleTops,
    top_people: handleTops,
    top_engagement: handleTops,
    top_location: handleTops,
    top_issue: handleTopIssues,
    top_issue_onm: handleTopIssues,

    // share of voice dan sentiment
    share_of_voice: handleShareOfVoices,
    share_of_voice_onm: handleShareOfVoices,
    sentiment: handleSentiment,
    sentiment_analyst: handleSentimentAnalyst,
    sentiment_analyst_onm: handleSentimentAnalyst,

    // day-to-day metrics
    day_to_day_engagement: handleDayToDays,
    day_to_day_followers_growth: handleDayToDays,
    day_to_day_talk: handleDayToDays,
    day_to_day_article: handleDayToDays,
    day_to_day_media: handleDayToDays,
    day_to_day_sentiment: handleDayToDaySentiment,
    day_to_day_sentiment_sosmed: handleDayToDaySentiment,

    // media & engagement breakdown
    breakdown_by_media: handleBreakdown,
    post_type: handlePostType,
    postmade: handlePostMade,
    engagement: handleEngagements,
    like: handleEngagements,
    share: handleEngagements,
    comment: handleEngagements,
    engagement_rate: handleEngagements,

    // topic and audience metrics
    interest: handleInterest,
    conversation: handleConversation,
    followers: handleFollowers,
    followers_growth: handleFollowersGrowth,

    // potential & peak metrics
    potential_reach: handlePotentials,
    potential_impresion: handlePotentials,
    peak_time_comment: handlePeakMetrics,
    peak_day_comment: handlePeakMetrics,
    peak_time_talk: handlePeakMetrics,
    peak_day_talk: handlePeakMetrics,

    // article metrics
    article_portal: handleArticlePortal,
    article_by_media: handleArticleByMedia,
    top_topic: handleArticlePortal,
    top_perception: handleArticlePortal,

    // advanced metrics
    advance_metric: handleAdvanceMetric,
    advance_metric_onm: handleAdvanceMetricOnm,

    // brand positioning
    brand_positioning: handleBrandPosition,
    brand_positioning_onm: handleBrandPosition,

    // wordcloud & totals
    wordcloud: handleWordCloud,
    news_total_article: handleNewsTotalArticle,
    total_article: handleTotals,
    total_media: handleTotals,
    total_pr_value: handleTotals,
};

export default metricHandlers;
