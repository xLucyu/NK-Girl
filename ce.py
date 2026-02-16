from math import ceil

# gonna implement that

TWO64 = 1 << 64
TWO63 = 1 << 63
MOD_PM = 2147483647
MOD_PM_MINUS1_NUM = 2147483646


def to_long(x: int) -> int:
    v = x & (TWO64 - 1)
    if v >= TWO63:
        v -= TWO64
    return v


def long_abs(x: int) -> int:
    if x == -TWO63:
        return x
    return -x if x < 0 else x


def I64(s: str) -> int:
    result = 0
    for c in s:
        digit = ord(c) - 48
        result = to_long(to_long(result * 10) + digit)
    return result


def get_seed_long(event_id: str) -> int:
    sb = ""
    for c in event_id:
        sb += str(ord(c))
    if len(sb) > 18:
        sb = sb[:18]
    parsed = I64(sb)
    return long_abs(parsed)


class SeededRandom:

    def __init__(self, seed: int):
        if seed < 0:
            seed = long_abs(seed)
        self.seed = seed

    def next(self) -> int:
        self.seed = to_long(self.seed * 16807)
        self.seed = self.seed % MOD_PM
        return self.seed

    def next_float(self) -> float:
        return self.next() / MOD_PM_MINUS1_NUM

    def range(self, min_val: int, max_val: int) -> int:
        if min_val == max_val:
            return min_val
        span = max_val - min_val
        r = self.next() % span
        return min_val + r


def shuffle_seeded(seed_long: int, input_list: list[str]) -> list[str]:
    
    rng = SeededRandom(seed_long)
    lst = input_list.copy()
    length = len(lst)

    for i in range(length):
        j = rng.range(i, length)
        if 0 <= j < length:
            lst[i], lst[j] = lst[j], lst[i]

    return lst


class CollectionEventFeaturedInstasHelper:

    def __init__(self):
        self.insta_monkeys_type_list: list[str] = []
        self.get_current_page_number = lambda: 0

    def get_possible_insta_monkeys(self) -> list[str]:
        lst = self.insta_monkeys_type_list
        if not lst:
            return []

        total_count = len(lst)
        page_size = ceil(total_count * 0.25)

        current_page = self.get_current_page_number()
        outer_index = 0

        while page_size < current_page:
            current_page -= page_size
            outer_index += 1

        max_items_per_page = 4
        page_items = []

        for i in range(max_items_per_page):
            rot_index = (i + outer_index + current_page * max_items_per_page) % total_count
            page_items.append(lst[rot_index])

        return page_items


def process_collection_event(event_data: dict) -> dict:

    seed = get_seed_long(event_data["id"])

    seconds_per_page = 28800  # 8 hours

    max_pages = ceil(
        (event_data["end"] - event_data["start"]) /
        (seconds_per_page * 1000)
    )

    featured_monkey_types = [
        "Alchemist", "BananaFarm", "BombShooter", "BoomerangMonkey",
        "DartMonkey", "Druid", "GlueGunner", "HeliPilot",
        "IceMonkey", "MonkeyAce", "MonkeyBuccaneer", "MonkeySub",
        "MonkeyVillage", "NinjaMonkey", "SniperMonkey", "SpikeFactory",
        "SuperMonkey", "TackShooter", "WizardMonkey", "MortarMonkey",
        "EngineerMonkey", "DartlingGunner", "BeastHandler",
        "Mermonkey", "Desperado"
    ]

    shuffled_monkey_types = shuffle_seeded(seed, featured_monkey_types)

    helper = CollectionEventFeaturedInstasHelper()
    helper.insta_monkeys_type_list = shuffled_monkey_types

    pages = {}

    for page in range(max_pages):
        helper.get_current_page_number = lambda p=page: p
        pages[page] = helper.get_possible_insta_monkeys()

    return {
        "id": event_data["id"],
        "start": event_data["start"],
        "end": event_data["end"],
        "rotations": pages
    }

data = process_collection_event({
    "id": "mlgz8x8o",
    "start": 1771466400000,
    "end": 1772244000000
})

print(data)
