from enum import Enum


class RecommendationType(str, Enum):
    PERSONALIZED = "PERSONALIZED"
    CONTEXTUAL = "CONTEXTUAL"
    COMPLEMENTARY = "COMPLEMENTARY"
    POPULAR = "POPULAR"


class DiscountType(str, Enum):
    PERCENTAGE = "PERCENTAGE"
    COMBO = "COMBO"
    BOGO = "BOGO"
    FIXED_AMOUNT = "FIXED_AMOUNT"


class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"
