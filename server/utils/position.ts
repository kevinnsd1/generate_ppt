
interface Position {
    x: number;
    y: number;
    w?: number;
    h?: number;
    xTitle?: number;
    yTitle?: number;
    [key: string]: any;
}

interface SummaryConfig {
    enabled: boolean;
    position: 'left' | 'top';
}

function transformPosition(position: Position, x = 0, y = 0) {
    return {
        ...position,
        x: position.x + x,
        y: position.y + y,
        xTitle: (position.xTitle || 0) + x,
        yTitle: (position.yTitle || 0) + y,
    };
}

function generatePosition(slideType: string, counter: number) {
    const {
        SIX_CONTENT_LINK_1, SIX_CONTENT_LINK_2, SIX_CONTENT_LINK_3, SIX_CONTENT_LINK_4, SIX_CONTENT_LINK_5, SIX_CONTENT_LINK_6,
        SINGLE_CONTENT_1,
        TWO_CONTENT_1, TWO_CONTENT_2,
        TWO_ROW_1, TWO_ROW_2,
        THREE_CONTENT_1, THREE_CONTENT_2, THREE_CONTENT_3,
        FOUR_CONTENT_1, FOUR_CONTENT_2, FOUR_CONTENT_3, FOUR_CONTENT_4,
        NINE_CONTENT_1, NINE_CONTENT_2, NINE_CONTENT_3, NINE_CONTENT_4, NINE_CONTENT_5, NINE_CONTENT_6, NINE_CONTENT_7, NINE_CONTENT_8, NINE_CONTENT_9,
        FOUR_COLUMN_1, FOUR_COLUMN_2, FOUR_COLUMN_3, FOUR_COLUMN_4,
        SIX_CONTENT_1, SIX_CONTENT_2, SIX_CONTENT_3, SIX_CONTENT_4, SIX_CONTENT_5, SIX_CONTENT_6,
        ONE_THREE_CONTENT_1, ONE_THREE_CONTENT_2, ONE_THREE_CONTENT_3, ONE_THREE_CONTENT_4,
        ONE_TWO_CONTENT_1, ONE_TWO_CONTENT_2, ONE_TWO_CONTENT_3,
        THREE_ONE_CONTENT_1, THREE_ONE_CONTENT_2, THREE_ONE_CONTENT_3, THREE_ONE_CONTENT_4,
        TWO_ONE_CONTENT_1, TWO_ONE_CONTENT_2, TWO_ONE_CONTENT_3,
        TWO_ONE_RIGHT_CONTENT_1, TWO_ONE_RIGHT_CONTENT_2, TWO_ONE_RIGHT_CONTENT_3,
    } = require('../controllers/size_position');

    let position = null;
    if (slideType == 'singleContents' || slideType == 'singleContent') {
        if (counter == 0) {
            position = SINGLE_CONTENT_1;
        }
    } else if (slideType == 'twoContents') {
        if (counter == 0) {
            position = TWO_CONTENT_1;
        } else {
            position = TWO_CONTENT_2;
        }
    } else if (slideType == 'fourContents') {
        if (counter == 0) {
            position = FOUR_CONTENT_1;
        } else if (counter == 1) {
            position = FOUR_CONTENT_2;
        } else if (counter == 2) {
            position = FOUR_CONTENT_3;
        } else if (counter == 3) {
            position = FOUR_CONTENT_4;
        }
    } else if (slideType == 'nineContents') {
        if (counter == 0) {
            position = NINE_CONTENT_1;
        } else if (counter == 1) {
            position = NINE_CONTENT_2;
        } else if (counter == 2) {
            position = NINE_CONTENT_3;
        } else if (counter == 3) {
            position = NINE_CONTENT_4;
        } else if (counter == 4) {
            position = NINE_CONTENT_5;
        } else if (counter == 5) {
            position = NINE_CONTENT_6;
        } else if (counter == 6) {
            position = NINE_CONTENT_7;
        } else if (counter == 7) {
            position = NINE_CONTENT_8;
        } else if (counter == 8) {
            position = NINE_CONTENT_9;
        }
    } else if (slideType == 'verticalFourContents') {
        if (counter == 0) {
            position = FOUR_COLUMN_1;
        } else if (counter == 1) {
            position = FOUR_COLUMN_2;
        } else if (counter == 2) {
            position = FOUR_COLUMN_3;
        } else if (counter == 3) {
            position = FOUR_COLUMN_4;
        }
    } else if (slideType == 'sixContents') {
        if (counter == 0) {
            position = SIX_CONTENT_1;
        } else if (counter == 1) {
            position = SIX_CONTENT_2;
        } else if (counter == 2) {
            position = SIX_CONTENT_3;
        } else if (counter == 3) {
            position = SIX_CONTENT_4;
        } else if (counter == 4) {
            position = SIX_CONTENT_5;
        } else if (counter == 5) {
            position = SIX_CONTENT_6;
        }
    } else if (slideType == 'oneThreeContents') {
        if (counter == 0) {
            position = ONE_THREE_CONTENT_1;
        } else if (counter == 1) {
            position = ONE_THREE_CONTENT_2;
        } else if (counter == 2) {
            position = ONE_THREE_CONTENT_3;
        } else if (counter == 3) {
            position = ONE_THREE_CONTENT_4;
        }
    } else if (slideType == 'oneTwoContents') {
        if (counter == 0) {
            position = ONE_TWO_CONTENT_1;
        } else if (counter == 1) {
            position = ONE_TWO_CONTENT_2;
        } else if (counter == 2) {
            position = ONE_TWO_CONTENT_3;
        }
    } else if (slideType == 'twoOneRightContents') {
        if (counter == 0) {
            position = TWO_ONE_RIGHT_CONTENT_1;
        } else if (counter == 1) {
            position = TWO_ONE_RIGHT_CONTENT_2;
        } else if (counter == 2) {
            position = TWO_ONE_RIGHT_CONTENT_3;
        }
    } else if (slideType === 'threeContents') {
        if (counter === 0) {
            position = THREE_CONTENT_1;
        } else if (counter === 1) {
            position = THREE_CONTENT_2;
        } else if (counter === 2) {
            position = THREE_CONTENT_3;
        }
    } else if (slideType == 'threeOneContents') {
        if (counter == 0) {
            position = THREE_ONE_CONTENT_1;
        } else if (counter == 1) {
            position = THREE_ONE_CONTENT_2;
        } else if (counter == 2) {
            position = THREE_ONE_CONTENT_3;
        } else if (counter == 3) {
            position = THREE_ONE_CONTENT_4;
        }
    } else if (slideType == 'twoOneContents') {
        if (counter == 0) {
            position = TWO_ONE_CONTENT_1;
        } else if (counter == 1) {
            position = TWO_ONE_CONTENT_2;
        } else if (counter == 2) {
            position = TWO_ONE_CONTENT_3;
        }
    } else if (slideType == 'threeColumns') {
        if (counter == 0) {
            position = { ...THREE_ONE_CONTENT_1, h: THREE_ONE_CONTENT_1.h + 2.5 };
        } else if (counter == 1) {
            position = { ...THREE_ONE_CONTENT_2, h: THREE_ONE_CONTENT_2.h + 2.5 };
        } else if (counter == 2) {
            position = { ...THREE_ONE_CONTENT_3, h: THREE_ONE_CONTENT_3.h + 2.5 };
        }
    } else if (slideType == 'twoRows') {
        if (counter == 0) {
            position = TWO_ROW_1;
        } else {
            position = TWO_ROW_2;
        }
    }
    return position;
}

function adjustPositionForSummary(position: Position, summaryConfig: SummaryConfig) {
    if (!position || !summaryConfig || !summaryConfig.enabled) {
        return position;
    }

    const adjustedPosition = { ...position };

    if (summaryConfig.position === 'left') {
        // Shift right to make room for summary (summary takes ~2.5 width)
        const xShift = 2.5;
        adjustedPosition.x = position.x + xShift;

        // Scale down width to fit remaining space (~80% of original)
        const widthScale = 0.8;
        if (position.w) {
            adjustedPosition.w = position.w * widthScale;
        }
    }

    return adjustedPosition;
}


function generateCustomPosition(type: string, counter: number) {
    const {
        SIX_CONTENT_LINK_1, SIX_CONTENT_LINK_2, SIX_CONTENT_LINK_3, SIX_CONTENT_LINK_4, SIX_CONTENT_LINK_5, SIX_CONTENT_LINK_6,
        SIX_CONTENT_1, SIX_CONTENT_2, SIX_CONTENT_3, SIX_CONTENT_4, SIX_CONTENT_5, SIX_CONTENT_6,
        SAMPLE_POST_CONTENT_1, SAMPLE_POST_CONTENT_2, SAMPLE_POST_CONTENT_3, SAMPLE_POST_CONTENT_4,
        SAMPLE_POST_CONTENT_1_LINK, SAMPLE_POST_CONTENT_2_LINK, SAMPLE_POST_CONTENT_3_LINK, SAMPLE_POST_CONTENT_4_LINK,
        SAMPLE_TALK_NINE_CONTENT_1, SAMPLE_TALK_NINE_CONTENT_2, SAMPLE_TALK_NINE_CONTENT_3, SAMPLE_TALK_NINE_CONTENT_4,
        SAMPLE_TALK_NINE_CONTENT_5, SAMPLE_TALK_NINE_CONTENT_6, SAMPLE_TALK_NINE_CONTENT_7, SAMPLE_TALK_NINE_CONTENT_8, SAMPLE_TALK_NINE_CONTENT_9,
        SAMPLE_TALK_NINE_CONTENT_1_LINK, SAMPLE_TALK_NINE_CONTENT_2_LINK, SAMPLE_TALK_NINE_CONTENT_3_LINK, SAMPLE_TALK_NINE_CONTENT_4_LINK,
        SAMPLE_TALK_NINE_CONTENT_5_LINK, SAMPLE_TALK_NINE_CONTENT_6_LINK, SAMPLE_TALK_NINE_CONTENT_7_LINK, SAMPLE_TALK_NINE_CONTENT_8_LINK, SAMPLE_TALK_NINE_CONTENT_9_LINK,
    } = require('../controllers/size_position');

    let position = null;
    if (type == 'sampleTalkSingle') {
        if (counter == 0) {
            position = SIX_CONTENT_1;
        } else if (counter == 1) {
            position = SIX_CONTENT_2;
        } else if (counter == 2) {
            position = SIX_CONTENT_3;
        } else if (counter == 3) {
            position = SIX_CONTENT_4;
        } else if (counter == 4) {
            position = SIX_CONTENT_5;
        } else if (counter == 5) {
            position = SIX_CONTENT_6;
        }
    } else if (type == 'sampleTalkSingleLink') {
        if (counter == 0) {
            position = SIX_CONTENT_LINK_1;
        } else if (counter == 1) {
            position = SIX_CONTENT_LINK_2;
        } else if (counter == 2) {
            position = SIX_CONTENT_LINK_3;
        } else if (counter == 3) {
            position = SIX_CONTENT_LINK_4;
        } else if (counter == 4) {
            position = SIX_CONTENT_LINK_5;
        } else if (counter == 5) {
            position = SIX_CONTENT_LINK_6;
        }
    } else if (type == 'sampleArticle') {
        if (counter == 0) {
            position = SIX_CONTENT_1;
        } else if (counter == 1) {
            position = SIX_CONTENT_2;
        } else if (counter == 2) {
            position = SIX_CONTENT_3;
        } else if (counter == 3) {
            position = SIX_CONTENT_4;
        } else if (counter == 4) {
            position = SIX_CONTENT_5;
        } else if (counter == 5) {
            position = SIX_CONTENT_6;
        }
    } else if (type == 'sampleArticleLink') {
        if (counter == 0) {
            position = SIX_CONTENT_LINK_1;
        } else if (counter == 1) {
            position = SIX_CONTENT_LINK_2;
        } else if (counter == 2) {
            position = SIX_CONTENT_LINK_3;
        } else if (counter == 3) {
            position = SIX_CONTENT_LINK_4;
        } else if (counter == 4) {
            position = SIX_CONTENT_LINK_5;
        } else if (counter == 5) {
            position = SIX_CONTENT_LINK_6;
        }
    } else if (type == 'sampleArticleThreeGrid') {
        // For 3 articles with summary - use full width horizontal layout
        if (counter == 0) {
            position = { x: 0.5, y: 1.19, w: 4.0, h: 2.5 }; // Left
        } else if (counter == 1) {
            position = { x: 4.7, y: 1.19, w: 4.0, h: 2.5 }; // Center
        } else if (counter == 2) {
            position = { x: 8.9, y: 1.19, w: 4.0, h: 2.5 }; // Right
        }
    } else if (type == 'sampleArticleThreeGridLink') {
        if (counter == 0) {
            position = { x: 1.5, y: 4.0 };
        } else if (counter == 1) {
            position = { x: 5.7, y: 4.0 };
        } else if (counter == 2) {
            position = { x: 9.9, y: 4.0 };
        }
    } else if (type == 'samplePost') {
        if (counter == 0) {
            position = SAMPLE_POST_CONTENT_1;
        } else if (counter == 1) {
            position = SAMPLE_POST_CONTENT_2;
        } else if (counter == 2) {
            position = SAMPLE_POST_CONTENT_3;
        } else if (counter == 3) {
            position = SAMPLE_POST_CONTENT_4;
        }
    } else if (type == 'samplePostLink') {
        if (counter == 0) {
            position = SAMPLE_POST_CONTENT_1_LINK;
        } else if (counter == 1) {
            position = SAMPLE_POST_CONTENT_2_LINK;
        } else if (counter == 2) {
            position = SAMPLE_POST_CONTENT_3_LINK;
        } else if (counter == 3) {
            position = SAMPLE_POST_CONTENT_4_LINK;
        }
    } else if (type == 'sampleTalkSixGrid') {
        // For 6 conversations with summary - 2 rows x 3 columns
        if (counter == 0) {
            position = { x: 0.5, y: 1.25, w: 4.0, h: 1.54 }; // Row 1, Col 1
        } else if (counter == 1) {
            position = { x: 4.6, y: 1.25, w: 4.0, h: 1.54 }; // Row 1, Col 2
        } else if (counter == 2) {
            position = { x: 8.7, y: 1.25, w: 4.0, h: 1.54 }; // Row 1, Col 3
        } else if (counter == 3) {
            position = { x: 0.5, y: 3.1, w: 4.0, h: 1.54 }; // Row 2, Col 1
        } else if (counter == 4) {
            position = { x: 4.6, y: 3.1, w: 4.0, h: 1.54 }; // Row 2, Col 2
        } else if (counter == 5) {
            position = { x: 8.7, y: 3.1, w: 4.0, h: 1.54 }; // Row 2, Col 3
        }
    } else if (type == 'sampleTalkSixGridLink') {
        if (counter == 0) {
            position = { x: 0.9, y: 1.95 };
        } else if (counter == 1) {
            position = { x: 5.0, y: 1.95 };
        } else if (counter == 2) {
            position = { x: 9.1, y: 1.95 };
        } else if (counter == 3) {
            position = { x: 0.9, y: 3.8 };
        } else if (counter == 4) {
            position = { x: 5.0, y: 3.8 };
        } else if (counter == 5) {
            position = { x: 9.1, y: 3.8 };
        }
    } else if (type == 'sampleTalk') {
        if (counter == 0) {
            position = SAMPLE_TALK_NINE_CONTENT_1;
        } else if (counter == 1) {
            position = SAMPLE_TALK_NINE_CONTENT_2;
        } else if (counter == 2) {
            position = SAMPLE_TALK_NINE_CONTENT_3;
        } else if (counter == 3) {
            position = SAMPLE_TALK_NINE_CONTENT_4;
        } else if (counter == 4) {
            position = SAMPLE_TALK_NINE_CONTENT_5;
        } else if (counter == 5) {
            position = SAMPLE_TALK_NINE_CONTENT_6;
        } else if (counter == 6) {
            position = SAMPLE_TALK_NINE_CONTENT_7;
        } else if (counter == 7) {
            position = SAMPLE_TALK_NINE_CONTENT_8;
        } else if (counter == 8) {
            position = SAMPLE_TALK_NINE_CONTENT_9;
        }
    } else if (type == 'sampleTalkLink') {
        if (counter == 0) {
            position = SAMPLE_TALK_NINE_CONTENT_1_LINK;
        } else if (counter == 1) {
            position = SAMPLE_TALK_NINE_CONTENT_2_LINK;
        } else if (counter == 2) {
            position = SAMPLE_TALK_NINE_CONTENT_3_LINK;
        } else if (counter == 3) {
            position = SAMPLE_TALK_NINE_CONTENT_4_LINK;
        } else if (counter == 4) {
            position = SAMPLE_TALK_NINE_CONTENT_5_LINK;
        } else if (counter == 5) {
            position = SAMPLE_TALK_NINE_CONTENT_6_LINK;
        } else if (counter == 6) {
            position = SAMPLE_TALK_NINE_CONTENT_7_LINK;
        } else if (counter == 7) {
            position = SAMPLE_TALK_NINE_CONTENT_8_LINK;
        } else if (counter == 8) {
            position = SAMPLE_TALK_NINE_CONTENT_9_LINK;
        }
    }
    if (!position) {
        throw new Error(`Position is null for slideType: ${type}, counter: ${counter}`);
    }
    return transformPosition(position, 0, 0.48);
}

function getSamplePostPositions(amount: number) {
    const {
        SAMPLE_POST_CONTENT_1, SAMPLE_POST_CONTENT_2, SAMPLE_POST_CONTENT_3, SAMPLE_POST_CONTENT_4
    } = require('../controllers/size_position');

    if (typeof amount !== 'number') {
        throw new Error("Amount must be a number");
    }
    if (amount === 1) return [{ x: 5.25, y: 1.0, w: 2.84, h: 5.12 }];
    if (amount === 2)
        return [
            { x: 3.69, y: 1.0, w: 2.84, h: 5.12 },
            { x: 6.89, y: 1.0, w: 2.84, h: 5.12 },
        ];
    if (amount === 3)
        return [
            { x: 2.03, y: 1.0, w: 2.84, h: 5.12 },
            { x: 5.23, y: 1.0, w: 2.84, h: 5.12 },
            { x: 8.49, y: 1.0, w: 2.84, h: 5.12 },
        ];
    if (amount === 4) return [SAMPLE_POST_CONTENT_1, SAMPLE_POST_CONTENT_2, SAMPLE_POST_CONTENT_3, SAMPLE_POST_CONTENT_4];

    return [];
}

function getSamplePostLinkPosition(amount: number) {
    if (typeof amount !== 'number') {
        throw new Error("Amount must be a number");
    }
    if (amount === 1) return [{ x: 6.14, y: 6.2, w: 1, h: 0 }];
    if (amount === 2)
        return [
            { x: 4.61, y: 6.2, w: 1.0, h: 0 },
            { x: 7.8, y: 6.2, w: 1.0, h: 0 },
        ];
    if (amount === 3)
        return [
            { x: 2.94, y: 6.2, w: 1.0, h: 0 },
            { x: 6.13, y: 6.2, w: 1.0, h: 0 },
            { x: 9.4, y: 6.2, w: 1.0, h: 0 },
        ];
    if (amount === 4)
        return [
            { x: 1.38, y: 6.3, w: 1.0, h: 0 },
            { x: 4.57, y: 6.3, w: 1.0, h: 0 },
            { x: 7.84, y: 6.3, w: 1.0, h: 0 },
            { x: 11.06, y: 6.3, w: 1.0, h: 0 },
        ];
    return [];
}

function getSummaryBoxPosition(position: string) {
    const {
        SUMMARY_BOX_LEFT,
        SUMMARY_BOX_TOP,
    } = require('../controllers/size_position');

    if (position === 'left') return SUMMARY_BOX_LEFT;
    if (position === 'top') return SUMMARY_BOX_TOP;
    return null;
}

function generatePositionWithSummary(slideType: string, counter: number, summaryConfig: SummaryConfig) {
    // If summary is disabled or not configured, return normal position
    if (!summaryConfig || !summaryConfig.enabled || !summaryConfig.position) {
        return generatePosition(slideType, counter);
    }

    const {
        TWO_ONE_CONTENT_1_WITH_SUMMARY_LEFT, TWO_ONE_CONTENT_2_WITH_SUMMARY_LEFT, TWO_ONE_CONTENT_3_WITH_SUMMARY_LEFT,
        TWO_ONE_CONTENT_1_WITH_SUMMARY_TOP, TWO_ONE_CONTENT_2_WITH_SUMMARY_TOP, TWO_ONE_CONTENT_3_WITH_SUMMARY_TOP,
        ONE_TWO_CONTENT_1_WITH_SUMMARY_LEFT, ONE_TWO_CONTENT_2_WITH_SUMMARY_LEFT, ONE_TWO_CONTENT_3_WITH_SUMMARY_LEFT,
        ONE_TWO_CONTENT_1_WITH_SUMMARY_TOP, ONE_TWO_CONTENT_2_WITH_SUMMARY_TOP, ONE_TWO_CONTENT_3_WITH_SUMMARY_TOP,
        THREE_ONE_CONTENT_1_WITH_SUMMARY_LEFT, THREE_ONE_CONTENT_2_WITH_SUMMARY_LEFT, THREE_ONE_CONTENT_3_WITH_SUMMARY_LEFT, THREE_ONE_CONTENT_4_WITH_SUMMARY_LEFT,
        THREE_ONE_CONTENT_1_WITH_SUMMARY_TOP, THREE_ONE_CONTENT_2_WITH_SUMMARY_TOP, THREE_ONE_CONTENT_3_WITH_SUMMARY_TOP, THREE_ONE_CONTENT_4_WITH_SUMMARY_TOP,
        SINGLE_CONTENT_1_WITH_SUMMARY_LEFT, SINGLE_CONTENT_1_WITH_SUMMARY_TOP,
        TWO_CONTENT_1_WITH_SUMMARY_LEFT, TWO_CONTENT_2_WITH_SUMMARY_LEFT,
        TWO_CONTENT_1_WITH_SUMMARY_TOP, TWO_CONTENT_2_WITH_SUMMARY_TOP,
        THREE_CONTENT_1_WITH_SUMMARY_LEFT, THREE_CONTENT_2_WITH_SUMMARY_LEFT, THREE_CONTENT_3_WITH_SUMMARY_LEFT,
        FOUR_CONTENT_1_WITH_SUMMARY_LEFT, FOUR_CONTENT_2_WITH_SUMMARY_LEFT, FOUR_CONTENT_3_WITH_SUMMARY_LEFT, FOUR_CONTENT_4_WITH_SUMMARY_LEFT,
        FOUR_COLUMN_1_WITH_SUMMARY_LEFT, FOUR_COLUMN_2_WITH_SUMMARY_LEFT, FOUR_COLUMN_3_WITH_SUMMARY_LEFT, FOUR_COLUMN_4_WITH_SUMMARY_LEFT,
        FOUR_COLUMN_1_WITH_SUMMARY_TOP, FOUR_COLUMN_2_WITH_SUMMARY_TOP, FOUR_COLUMN_3_WITH_SUMMARY_TOP, FOUR_COLUMN_4_WITH_SUMMARY_TOP,
    } = require('../controllers/size_position');

    const summaryPosition = summaryConfig.position;
    let position = null;

    // TWO CONTENTS
    if (slideType === 'twoContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = TWO_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = TWO_CONTENT_2_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            if (counter === 0) position = TWO_CONTENT_1_WITH_SUMMARY_TOP;
            else if (counter === 1) position = TWO_CONTENT_2_WITH_SUMMARY_TOP;
        }
    }

    // THREE CONTENTS
    else if (slideType === 'threeContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = THREE_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = THREE_CONTENT_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = THREE_CONTENT_3_WITH_SUMMARY_LEFT;
        }
    }

    // FOUR CONTENTS
    else if (slideType === 'fourContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = FOUR_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = FOUR_CONTENT_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = FOUR_CONTENT_3_WITH_SUMMARY_LEFT;
            else if (counter === 3) position = FOUR_CONTENT_4_WITH_SUMMARY_LEFT;
        }
    }

    // VERTICAL FOUR CONTENTS
    else if (slideType === 'verticalFourContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = FOUR_COLUMN_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = FOUR_COLUMN_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = FOUR_COLUMN_3_WITH_SUMMARY_LEFT;
            else if (counter === 3) position = FOUR_COLUMN_4_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            if (counter === 0) position = FOUR_COLUMN_1_WITH_SUMMARY_TOP;
            else if (counter === 1) position = FOUR_COLUMN_2_WITH_SUMMARY_TOP;
            else if (counter === 2) position = FOUR_COLUMN_3_WITH_SUMMARY_TOP;
            else if (counter === 3) position = FOUR_COLUMN_4_WITH_SUMMARY_TOP;
        }
    }

    // TWO ONE CONTENTS
    if (slideType === 'twoOneContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = TWO_ONE_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = TWO_ONE_CONTENT_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = TWO_ONE_CONTENT_3_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            if (counter === 0) position = TWO_ONE_CONTENT_1_WITH_SUMMARY_TOP;
            else if (counter === 1) position = TWO_ONE_CONTENT_2_WITH_SUMMARY_TOP;
            else if (counter === 2) position = TWO_ONE_CONTENT_3_WITH_SUMMARY_TOP;
        }
    }

    // ONE TWO CONTENTS
    else if (slideType === 'oneTwoContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = ONE_TWO_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = ONE_TWO_CONTENT_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = ONE_TWO_CONTENT_3_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            if (counter === 0) position = ONE_TWO_CONTENT_1_WITH_SUMMARY_TOP;
            else if (counter === 1) position = ONE_TWO_CONTENT_2_WITH_SUMMARY_TOP;
            else if (counter === 2) position = ONE_TWO_CONTENT_3_WITH_SUMMARY_TOP;
        }
    }

    // THREE ONE CONTENTS
    else if (slideType === 'threeOneContents') {
        if (summaryPosition === 'left') {
            if (counter === 0) position = THREE_ONE_CONTENT_1_WITH_SUMMARY_LEFT;
            else if (counter === 1) position = THREE_ONE_CONTENT_2_WITH_SUMMARY_LEFT;
            else if (counter === 2) position = THREE_ONE_CONTENT_3_WITH_SUMMARY_LEFT;
            else if (counter === 3) position = THREE_ONE_CONTENT_4_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            if (counter === 0) position = THREE_ONE_CONTENT_1_WITH_SUMMARY_TOP;
            else if (counter === 1) position = THREE_ONE_CONTENT_2_WITH_SUMMARY_TOP;
            else if (counter === 2) position = THREE_ONE_CONTENT_3_WITH_SUMMARY_TOP;
            else if (counter === 3) position = THREE_ONE_CONTENT_4_WITH_SUMMARY_TOP;
        }
    }

    // SINGLE CONTENTS
    else if (slideType === 'singleContents' || slideType === 'singleContent') {
        if (summaryPosition === 'left') {
            position = SINGLE_CONTENT_1_WITH_SUMMARY_LEFT;
        } else if (summaryPosition === 'top') {
            position = SINGLE_CONTENT_1_WITH_SUMMARY_TOP;
        }
    }

    // If position not found for this summary config, fall back to normal position
    if (!position) {
        // Check if it's a known summary-compatible type but configuration is missing/disabled
        const summaryCompatibleTypes = [
            'singleContents', 'singleContent',
            'twoContents', 'threeContents', 'fourContents',
            'threeOneContents', 'oneTwoContents', 'twoOneContents',
            'verticalFourContents' // added
        ];

        // Only warn if we expected a position but didn't get one (and it's not simply disabled)
        if (summaryConfig && summaryConfig.enabled && summaryCompatibleTypes.includes(slideType)) {
            console.warn(`Summary position '${summaryPosition}' not supported for slideType '${slideType}', using normal position`);
        }

        return generatePosition(slideType, counter);
    }

    return position;
}

function getCenteredPosition(slideType: string) {
    const { TWO_CONTENT_CENTER } = require('../controllers/size_position');

    if (slideType === 'twoContents') {
        return TWO_CONTENT_CENTER; // Return raw object, controller applies transformPosition
    }
    return null;
}

export {
    transformPosition,
    generatePosition,
    generateCustomPosition,
    getSamplePostPositions,
    getSamplePostLinkPosition,
    generatePositionWithSummary,
    getSummaryBoxPosition,
    adjustPositionForSummary,
    getCenteredPosition,
}
