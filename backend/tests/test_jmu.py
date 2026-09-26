from app.services.jmu import compile_html, jmu_to_text


def test_headers_paragraphs_and_inline():
    html = (
        "<div><h2>Ruling</h2>"
        "<p>This is the <strong>answer</strong> with a "
        '<a href="https://x.com">link</a>.</p></div>'
    )
    jmu = compile_html(html).jmu
    assert "## Ruling" in jmu
    assert "This is the **answer** with a [link](https://x.com)." in jmu


def test_blockquote_and_lists():
    html = (
        "<div><blockquote>Allah knows best.</blockquote>"
        "<ul><li>First</li><li>Second</li></ul>"
        "<ol><li>One</li><li>Two</li></ol></div>"
    )
    jmu = compile_html(html).jmu
    assert "> Allah knows best." in jmu
    assert "- First" in jmu and "- Second" in jmu
    assert "1. One" in jmu and "2. Two" in jmu


def test_drops_scripts_styles_and_ads():
    html = (
        "<div><p>Keep me.</p><script>evil()</script>"
        "<style>.x{}</style>"
        '<div class="original_source"><a href="/s">src</a></div></div>'
    )
    jmu = compile_html(html).jmu
    assert "Keep me." in jmu
    assert "evil" not in jmu and "original" not in jmu and "src" not in jmu


def test_deterministic():
    html = "<div><h3>Q</h3><p>Body <em>here</em>.</p></div>"
    assert compile_html(html).jmu == compile_html(html).jmu


def test_plain_text_strips_markup():
    html = '<div><h2>T</h2><p><strong>Bold</strong> <a href="/x">link</a></p></div>'
    text = compile_html(html).text
    assert "**" not in text and "[" not in text and "](" not in text
    assert "Bold" in text and "link" in text


def test_jmu_to_text_directly():
    jmu = "## Title\n\n**Bold** and *italic* with [a](http://x)\n\n- item"
    text = jmu_to_text(jmu)
    assert text.startswith("Title")
    assert "**" not in text and "*" not in text
    assert "a" in text and "http://x" not in text
