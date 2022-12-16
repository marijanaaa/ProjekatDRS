from enum import Enum

class transaction_state(Enum):
    PROCESSING = 1,
    PROCESSED = 2,
    DENIED = 3