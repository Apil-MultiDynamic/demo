(() => {
    const normalize = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();
    const currentFile = window.location.pathname.split("/").pop() || "home.html";
    const currentPage = (document.body.dataset.page || currentFile.replace(".html", "")).toLowerCase();
    const navPageMap = {
        about: "about.html",
        agent: "agents.html",
        agents: "agents.html",
        buy: "buy.html",
        home: "",
        office: "office.html",
        rent: "rent.html"
    };

    const isLogoLink = (element) => {
        if (element.tagName !== "A") {
            return false;
        }

        const image = element.querySelector("img");
        if (!image) {
            return false;
        }

        const altText = normalize(image.getAttribute("alt") || "");
        return altText.includes("multidynamic");
    };

    const routeRules = [
        {
            href: "home.html",
            match: (text, element) => isLogoLink(element) || text === "home" || text.includes("back home")
        },
        {
            href: "buy.html",
            match: (text) => text === "buy"
        },
        {
            href: "buy.html#buy-listings",
            match: (text) => text.includes("view properties") || text.includes("latest listings")
        },
        {
            href: "rent.html",
            match: (text) => text === "rent"
        },
        {
            href: "rent.html#rental-listings",
            match: (text) => text.includes("browse rentals") || text.includes("all rentals")
        },
        {
            href: "rent.html#tenant-services",
            match: (text) => text.includes("manage property") || text.includes("tenant faq")
        },
        {
            href: "home.html#services",
            match: (text) => text === "sell" || text.includes("sell with us")
        },
        {
            href: "agents.html#agent-directory",
            match: (text) => text === "agents" || text.includes("find an agent") || text.includes("view entire team") || text.includes("our elite agents")
        },
        {
            href: "agent.html#agent-overview",
            match: (text) => text.includes("view profile")
        },
        {
            href: "office.html#office-list",
            match: (text) => text === "offices" || text.includes("find an office") || text.includes("our offices") || text.includes("view office") || text.includes("visit head office")
        },
        {
            href: "about.html#about-story",
            match: (text) => text === "about" || text.includes("about us") || text.includes("about multidynamic") || text.includes("our philosophy")
        },
        {
            href: "about.html#join-us",
            match: (text) => text.includes("join us") || text.includes("explore careers") || text.includes("partner with us") || text.includes("view careers") || text.includes("career portal") || text.includes("franchise opportunities") || text.includes("join multidynamic") || text === "careers"
        },
        {
            href: "agent.html#book-appraisal",
            match: (text) => text.includes("book appraisal") || text.includes("request appraisal") || text === "appraisal"
        },
        {
            href: "about.html#contact",
            match: (text) => text.includes("contact us") || text.includes("newsletter signup") || text.includes("newsletter sign up") || text.includes("privacy policy") || text.includes("terms of service") || text.includes("cookie policy") || text.includes("compliance") || text.includes("disclaimer") || text.includes("switch to multidynamic")
        },
        {
            href: "home.html#insights",
            match: (text) => text.includes("news & insights") || text.includes("join insights")
        },
        {
            href: "agent.html#agent-listings",
            match: (text) => text.includes("sold properties")
        },
        {
            href: "office.html#office-list",
            match: (text) => text === "schofields" || text === "leppington" || text === "gregory hills" || text === "austral"
        }
    ];

    const resolveRoute = (element) => {
        const text = normalize(element.textContent || "");

        for (const rule of routeRules) {
            if (rule.match(text, element)) {
                return rule.href;
            }
        }

        return null;
    };

    const setRoute = (element, href) => {
        if (element.tagName === "A") {
            element.setAttribute("href", href);
            return;
        }

        if (element.dataset.routeBound === href) {
            return;
        }

        element.dataset.routeBound = href;
        element.style.cursor = "pointer";
        element.addEventListener("click", () => {
            window.location.href = href;
        });
    };

    document.querySelectorAll("a").forEach((anchor) => {
        const href = (anchor.getAttribute("href") || "").trim();
        const isPlaceholder = !href || href === "#" || href === "/" || href === "./";

        if (!isPlaceholder) {
            return;
        }

        const route = resolveRoute(anchor);
        if (route) {
            setRoute(anchor, route);
        }
    });

    document.querySelectorAll("button").forEach((button) => {
        if (button.closest("form")) {
            return;
        }

        if (button.hasAttribute("onclick")) {
            return;
        }

        const type = (button.getAttribute("type") || "").toLowerCase();
        if (type === "submit" || type === "reset") {
            return;
        }

        const route = resolveRoute(button);
        if (route) {
            setRoute(button, route);
        }
    });

    const activeRoute = navPageMap[currentPage] || "";
    document.querySelectorAll("body > nav a, body > header nav a").forEach((link) => {
        link.classList.add("text-secondary", "hover:text-primary", "transition-colors", "duration-200");
        link.classList.remove("text-on-surface", "dark:text-inverse-on-surface", "dark:text-primary-fixed", "dark:hover:text-primary-fixed-dim");
        link.classList.remove("text-primary", "border-b-2", "border-primary", "pb-1");

        if (!activeRoute) {
            return;
        }

        const href = (link.getAttribute("href") || "").split("#")[0];
        if (href === activeRoute) {
            link.classList.remove("text-secondary");
            link.classList.add("text-primary", "border-b-2", "border-primary", "pb-1");
        }
    });

    const revealTargets = [
        ...document.querySelectorAll("body > header:not(.fixed), body > section, main > header, main > section, footer")
    ];

    document.querySelectorAll("main").forEach((main) => {
        const hasSectionChildren = main.querySelector(":scope > section, :scope > header");
        if (!hasSectionChildren) {
            revealTargets.push(main);
        }
    });

    const uniqueTargets = [...new Set(revealTargets)].filter((element) => !element.matches("nav.fixed"));

    uniqueTargets.forEach((element, index) => {
        element.classList.add("reveal-section");
        element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        uniqueTargets.forEach((element) => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px"
    });

    uniqueTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.88) {
            requestAnimationFrame(() => {
                element.classList.add("is-visible");
            });
            return;
        }

        observer.observe(element);
    });
})();
