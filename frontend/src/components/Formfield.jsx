

export const Formfield = () => {
  return (
        <div className="mb-3">
            <label for="title" className="form-label">Title</label>
            <input name="listing[title]" value=" listing.title " placeholder="enter title" type="text"
                className="form-control" required />
                <div className="invalid-feedback">Give a title</div>
        </div>
  )
}
