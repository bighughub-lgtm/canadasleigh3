import LegalLayout from './LegalLayout'

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

function TextBlock({ text }) {
  return <p>{text}</p>
}

function ParagraphGroup({ items }) {
  const paragraphs = toArray(items)

  if (!paragraphs.length) return null

  return paragraphs.map((paragraph, index) => (
    <TextBlock key={`${paragraph.slice(0, 24)}-${index}`} text={paragraph} />
  ))
}

function ListBlock({ items }) {
  const entries = toArray(items)

  if (!entries.length) return null

  return (
    <ul>
      {entries.map((item, index) => (
        <li key={`${item.slice(0, 24)}-${index}`}>{item}</li>
      ))}
    </ul>
  )
}

function SubSection({ section }) {
  const heading = section.heading ?? section.title
  const paragraphs = toArray(section.paragraphs)
  const list = toArray(section.list)
  const closing = toArray(section.closing)

  if (!heading && !paragraphs.length && !list.length && !closing.length) {
    return null
  }

  return (
    <div className="legal-content-page__subsection">
      {heading ? <h3 className="legal-content-page__subsection-heading">{heading}</h3> : null}
      <ParagraphGroup items={paragraphs} />
      <ListBlock items={list} />
      <ParagraphGroup items={closing} />
    </div>
  )
}

function Section({ section, index }) {
  const heading = section.heading ?? section.title
  const paragraphs = toArray(section.paragraphs)
  const list = toArray(section.list)
  const extraParagraphs = toArray(section.extraParagraphs)
  const extraList = toArray(section.extraList)
  const closing = toArray(section.closing)
  const subSections = Array.isArray(section.subSections)
    ? section.subSections
    : Array.isArray(section.items)
      ? section.items
      : []

  return (
    <section className="legal-content-page__section">
      {heading ? <h2 className="legal-content-page__section-heading">{heading}</h2> : null}
      <ParagraphGroup items={paragraphs} />
      <ListBlock items={list} />
      <ParagraphGroup items={extraParagraphs} />
      <ListBlock items={extraList} />

      {subSections.length ? (
        <div className="legal-content-page__subsections">
          {subSections.map((subSection, subSectionIndex) => (
            <SubSection
              key={`${subSection.heading ?? subSection.title ?? 'subsection'}-${subSectionIndex}`}
              section={subSection}
            />
          ))}
        </div>
      ) : null}

      <ParagraphGroup items={closing} />
    </section>
  )
}

export default function LegalContentPage({ content }) {
  const intro = toArray(content?.intro)
  const sections = Array.isArray(content?.sections) ? content.sections : []

  return (
    <LegalLayout title={content?.title} effectiveDate={content?.effectiveDate}>
      <div className="legal-content-page">
        {intro.length ? (
          <div className="legal-content-page__intro">
            <ParagraphGroup items={intro} />
          </div>
        ) : null}

        {sections.length ? (
          <div className="legal-content-page__sections">
            {sections.map((section, index) => (
              <Section key={`${section.heading ?? section.title ?? 'section'}-${index}`} section={section} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </LegalLayout>
  )
}
